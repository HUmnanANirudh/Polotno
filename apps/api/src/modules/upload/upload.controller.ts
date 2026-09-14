import type { Request, Response } from 'express';
import * as uploadService from './upload.service.ts';
import { AppError } from '../../lib/app-error.ts';

export async function upload(req: Request, res: Response) {
  if (!req.file) {
    throw new AppError(400, 'No image file provided');
  }

  const result = await uploadService.uploadImageToCloudinary(req.file.buffer, req.file.mimetype);

  res.status(200).json({
    success: true,
    data: result,
  });
}
