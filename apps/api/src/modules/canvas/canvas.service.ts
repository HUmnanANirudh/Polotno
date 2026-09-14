import type { CreateCanvasInput, UpdateCanvasInput } from '@polotno/types';
import { prisma } from '../../config/prisma.ts';
import { AppError } from '../../lib/app-error.ts';

export async function create(userId: string, input: CreateCanvasInput) {
  return prisma.canvas.create({
    data: {
      ...input,
      userId,
    },
  });
}

export async function findAll(userId: string) {
  return prisma.canvas.findMany({
    where: { userId },
    select: {
      id: true,
      name: true,
      width: true,
      height: true,
      thumbnail: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { updatedAt: 'desc' },
  });
}

export async function findById(userId: string, canvasId: string) {
  const canvas = await prisma.canvas.findFirst({
    where: { id: canvasId, userId },
  });

  if (!canvas) {
    throw new AppError(404, 'Canvas not found');
  }

  return canvas;
}

export async function update(userId: string, canvasId: string, input: UpdateCanvasInput) {
  await findById(userId, canvasId);

  return prisma.canvas.update({
    where: { id: canvasId },
    data: input,
  });
}

export async function remove(userId: string, canvasId: string) {
  await findById(userId, canvasId);

  await prisma.canvas.delete({
    where: { id: canvasId },
  });
}
