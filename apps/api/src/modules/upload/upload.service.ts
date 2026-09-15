import { cloudinary } from '../../config/cloudinary.ts';
import { AppError } from '../../lib/app-error.ts';
import type { UploadApiResponse } from 'cloudinary';

export async function uploadImageToCloudinary(
  buffer: Buffer,
  mimetype: string
): Promise<{ url: string; publicId: string }> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'image',
      },
      (error, result) => {
        if (error || !result) {
          console.error('Cloudinary upload error:', error);
          reject(new AppError(500, `Failed to upload image to Cloudinary: ${error?.message || 'Unknown error'}`));
          return;
        }
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    stream.end(buffer);
  });
}
