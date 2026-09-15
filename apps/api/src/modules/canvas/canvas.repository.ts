import { CanvasModel } from './canvas.model.ts';
import type { CreateCanvasInput, UpdateCanvasInput } from '@polotno/types';

export async function create(userId: string, data: CreateCanvasInput) {
  const canvas = await CanvasModel.create({ ...data, userId });
  return Object.assign(canvas.toJSON(), { id: canvas._id.toString() });
}

export async function findAllByUser(userId: string) {
  const canvases = await CanvasModel.find({ userId })
    .select('name width height thumbnail createdAt updatedAt')
    .sort({ updatedAt: -1 });
  return canvases.map((c) => Object.assign(c.toJSON(), { id: c._id.toString() }));
}

export async function findByIdAndUser(canvasId: string, userId: string) {
  const canvas = await CanvasModel.findOne({ _id: canvasId, userId });
  return canvas ? Object.assign(canvas.toJSON(), { id: canvas._id.toString() }) : null;
}

export async function updateByIdAndUser(
  canvasId: string,
  userId: string,
  data: UpdateCanvasInput
) {
  const canvas = await CanvasModel.findOneAndUpdate(
    { _id: canvasId, userId },
    { $set: data },
    { new: true }
  );
  return canvas ? Object.assign(canvas.toJSON(), { id: canvas._id.toString() }) : null;
}

export async function deleteByIdAndUser(canvasId: string, userId: string) {
  const result = await CanvasModel.deleteOne({ _id: canvasId, userId });
  return result.deletedCount > 0;
}
