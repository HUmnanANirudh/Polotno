import { v2 as cloudinary } from 'cloudinary';
import { env } from './env.ts';

// Cloudinary v2 automatically picks up the CLOUDINARY_URL from process.env
// which is validated in env.ts

export { cloudinary };
