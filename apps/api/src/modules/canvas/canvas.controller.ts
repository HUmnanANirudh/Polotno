import type { Request, Response } from 'express';
import * as canvasService from './canvas.service.ts';

export async function create(req: Request, res: Response) {
  const userId = req.user!.userId;
  const input = req.body;
  const canvas = await canvasService.create(userId, input);
  res.status(201).json({
    success: true,
    data: canvas,
  });
}

export async function findAll(req: Request, res: Response) {
  const userId = req.user!.userId;
  const canvases = await canvasService.findAll(userId);
  res.status(200).json({
    success: true,
    data: canvases,
  });
}

export async function findById(req: Request, res: Response) {
  const userId = req.user!.userId;
  const canvasId = req.params.id;
  const canvas = await canvasService.findById(userId, canvasId);
  res.status(200).json({
    success: true,
    data: canvas,
  });
}

export async function update(req: Request, res: Response) {
  const userId = req.user!.userId;
  const canvasId = req.params.id;
  const input = req.body;
  const canvas = await canvasService.update(userId, canvasId, input);
  res.status(200).json({
    success: true,
    data: canvas,
  });
}

export async function remove(req: Request, res: Response) {
  const userId = req.user!.userId;
  const canvasId = req.params.id;
  await canvasService.remove(userId, canvasId);
  res.status(204).send();
}
