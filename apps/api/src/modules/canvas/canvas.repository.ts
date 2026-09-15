import { prisma } from '../../config/prisma.ts';
import type { CreateCanvasInput, UpdateCanvasInput } from '@polotno/types';

export async function create(userId: string, data: CreateCanvasInput) {
  return prisma.canvas.create({
    data: { ...data, userId },
  });
}

export async function findAllByUser(userId: string) {
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

export async function findByIdAndUser(canvasId: string, userId: string) {
  return prisma.canvas.findFirst({
    where: { id: canvasId, userId },
  });
}

export async function updateByIdAndUser(
  canvasId: string,
  userId: string,
  data: UpdateCanvasInput
) {
  const canvas = await prisma.canvas.findFirst({
    where: { id: canvasId, userId },
  });
  if (!canvas) return null;

  return prisma.canvas.update({
    where: { id: canvasId },
    data,
  });
}

export async function deleteByIdAndUser(canvasId: string, userId: string) {
  const canvas = await prisma.canvas.findFirst({
    where: { id: canvasId, userId },
  });
  if (!canvas) return false;

  await prisma.canvas.delete({ where: { id: canvasId } });
  return true;
}
