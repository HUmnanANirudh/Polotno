# Polotno

Polotno is a web-based design tool. Users can create, edit, and export visual designs using an interactive canvas.

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

## Repository Structure

This project uses a monorepo structure managed by Bun.

- `apps/web`: The frontend application. We build it with Next.js, React, Tailwind CSS, and React-Konva.
- `apps/api`: The backend API. We build it with Express, Prisma, and MongoDB.
- `packages/types`: Shared TypeScript definitions and Zod schemas. Both the frontend and backend use this package to validate data.

## Requirements

To run this project locally, you need:

- [Bun](https://bun.sh/)
- A MongoDB database
- A Cloudinary account (for image uploads)

## Setup Instructions

1. **Install Dependencies**
   Run this command in the root folder to install all packages:
   ```bash
   bun install
   ```

2. **Configure the Environment**
   You must provide environment variables for the backend. Create an `.env` file in `apps/api/` and add the following values:

   ```env
   DATABASE_URL="your_mongodb_connection_string"
   PORT=4000
   JWT_ACCESS_SECRET="your_access_secret"
   JWT_REFRESH_SECRET="your_refresh_secret"
   CLOUDINARY_URL="your_cloudinary_url"
   CORS_ORIGIN="http://localhost:3000"
   ```

3. **Start the Application**
   Run the development servers from the root folder:
   ```bash
   bun run dev
   ```
   This command starts both the frontend and backend at the same time. Open `http://localhost:3000` in your browser to use the app.
