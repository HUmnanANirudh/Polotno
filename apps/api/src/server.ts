import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './config/env.ts';
import { authRoutes } from './modules/auth/auth.routes.ts';
import { canvasRoutes } from './modules/canvas/canvas.routes.ts';
import { uploadRoutes } from './modules/upload/upload.routes.ts';
import { errorHandler } from './middleware/error-handler.ts';

const app = express();
const allowedOrigins = env.CORS_ORIGIN.split(',').map((origin) =>
  origin.trim().replace(/\/$/, '')
);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/canvases', canvasRoutes);
app.use('/api/upload', uploadRoutes);

app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT}`);
});

export default app;
