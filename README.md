# Polotno

Polotno is a web-based design tool. Users can create, edit, and export visual designs using an interactive canvas.

<img width="1884" height="890" alt="image" src="https://github.com/user-attachments/assets/a8cf8435-f955-4e95-badd-43e811f01573" />

## Features

### User Accounts and Dashboard
- **Authentication**: Users can create accounts and log in securely.
- **Dashboard**: Users can view, create, and delete their projects.
- **Thumbnails**: Projects display an automatic image preview of the canvas.

### Canvas Editor
- **Shapes and Text**: Add rectangles, circles, lines, arrows, and text.
- **Image Uploads**: Upload images directly to the canvas via Cloudinary.
- **Transformations**: Drag, resize, and rotate elements on the board.
- **Properties Panel**: Change colors, sizes, positions, borders, and text content using a sidebar.
- **Keyboard Controls**: Move items precisely with arrow keys and remove them with the Delete key.
- **History**: Undo and redo past actions.
- **Export**: Download the final design to your computer as a PNG file.

## Bonus Features
- **Smooth Scaling**: The canvas engine continuously updates visual states. This stops elements from snapping back when you resize them.
- **Automatic Previews**: The app automatically captures and scales down your canvas to create a thumbnail every time you save.
- **Strict Validation**: The frontend and backend share the exact same Zod validation rules to prevent bad data.

## Architecture

This project uses a monorepo structure managed by Bun. We split the code into three parts:

### 1. Frontend (`apps/web`)
We build the user interface with these tools:
- **Next.js & React**: The core framework for the website.
- **Zustand**: Manages the application state.
- **React-Konva**: Powers the interactive 2D canvas.
- **Tailwind CSS**: Styles the user interface.
- **Phosphor Icons**: Provides clean, scalable SVG icons for the interface.
- **React-Hot-Toast**: Shows success and error messages to the user.

### 2. Backend (`apps/api`)
We build the server with these tools:
- **Express**: Runs the web server.
- **Prisma**: The Object-Relational Mapper (ORM) that interacts with the database.
- **MongoDB**: The main database that stores users and projects.
- **Cloudinary**: Stores uploaded image files.

### 3. Packages (`packages/types`)
- **Zod**: Defines exact schemas to validate data on both the frontend and backend.

## Setup Instructions

### 1. Install Dependencies
Run this command in the root folder to install all packages:
```bash
bun install
```

### 2. MongoDB Setup
You must create a MongoDB database to store users and canvases. Prisma requires your MongoDB deployment to run as a replica set (MongoDB Atlas provides this by default).

1. Create a cluster on [MongoDB Atlas](https://www.mongodb.com/atlas) or run a local instance.
2. Copy your connection string.
3. Replace the `DATABASE_URL` value in your backend environment file.

### 3. Configure the Environment
Create an `.env` file in `apps/api/` and add the following values:

```env
DATABASE_URL="your_mongodb_connection_string"
PORT=4000
JWT_ACCESS_SECRET="your_access_secret"
JWT_REFRESH_SECRET="your_refresh_secret"
CLOUDINARY_URL="your_cloudinary_url"
CORS_ORIGIN="http://localhost:3000"
```

### 4. Push the Database Schema
Apply the Prisma schema to your MongoDB database:
```bash
cd apps/api
bunx prisma db push
cd ../..
```

### 5. Start the Application
Run the development servers from the root folder:
```bash
bun run dev
```
This command starts both the frontend and backend at the same time. Open `http://localhost:3000` in your browser to use the app.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create a new user.
- `POST /api/auth/login` - Log in an existing user.
- `GET /api/auth/me` - Read data for the current user.

### Canvases
- `GET /api/canvases` - List all projects for a user.
- `POST /api/canvases` - Create a new project.
- `GET /api/canvases/:id` - Read a specific project.
- `PUT /api/canvases/:id` - Update project data and its thumbnail.
- `DELETE /api/canvases/:id` - Delete a project.

### Uploads
- `POST /api/upload/image` - Send an image file to Cloudinary.

## Known Limitations

### General
- **No Multiplayer**: The application does not support real-time collaboration. Only one person can edit a canvas at a time.
- **Image Storage**: Deleting an image from the canvas removes it from the screen, but it does not delete the file from your Cloudinary storage.
- **Vector Export**: Users cannot export the canvas in vector formats like SVG. The app only exports raster PNG files.

### Canvas vs. Excalidraw
Compared to tools like Excalidraw, this canvas engine lacks several features:
- **Hit Detection**: We use rectangular bounding boxes to select elements. If you click the empty space near a diagonal line, it still selects the line. Excalidraw selects lines based on the exact stroke.
- **Art Style**: We draw perfect, rigid shapes. We do not support the hand-drawn, sketchy look of Excalidraw.
- **Canvas Size**: The canvas has a fixed width and height. It does not provide an infinite drawing board.
- **Freehand Drawing**: Users cannot draw freehand lines with a pencil tool.
- **Smart Connections**: Arrows do not automatically snap or lock onto shapes when you move them.
