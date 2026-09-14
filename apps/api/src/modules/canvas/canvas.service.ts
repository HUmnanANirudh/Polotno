import type { CreateCanvasInput, UpdateCanvasInput } from '@polotno/types';
import * as canvasRepository from './canvas.repository.ts';
import { AppError } from '../../lib/app-error.ts';

export async function create(userId: string, input: CreateCanvasInput) {
  return canvasRepository.create(userId, input);
}

export async function findAll(userId: string) {
  return canvasRepository.findAllByUser(userId);
}

export async function findById(userId: string, canvasId: string) {
  const canvas = await canvasRepository.findByIdAndUser(canvasId, userId);

  if (!canvas) {
    throw new AppError(404, 'Canvas not found');
  }

  return canvas;
}

export async function update(userId: string, canvasId: string, input: UpdateCanvasInput) {
  const canvas = await canvasRepository.updateByIdAndUser(canvasId, userId, input);

  if (!canvas) {
    throw new AppError(404, 'Canvas not found');
  }

  return canvas;
}

export async function remove(userId: string, canvasId: string) {
  const success = await canvasRepository.deleteByIdAndUser(canvasId, userId);

  if (!success) {
    throw new AppError(404, 'Canvas not found');
  }
}
