import type { Request, Response } from 'express';
import * as canvasService from './canvas.service.ts';

export async function create(req: Request, res: Response) {
  const canvas = await canvasService.create(req.user!.userId, req.body);
  res.status(201).json({
    success: true,
    data: canvas,
  });
}

export async function findAll(req: Request, res: Response) {
  const canvases = await canvasService.findAll(req.user!.userId);
  res.status(200).json({
    success: true,
    data: canvases,
  });
}

export async function findById(req: Request, res: Response) {
  const canvas = await canvasService.findById(req.user!.userId, req.params.id);
  res.status(200).json({
    success: true,
    data: canvas,
  });
}

export async function update(req: Request, res: Response) {
  const canvas = await canvasService.update(req.user!.userId, req.params.id, req.body);
  res.status(200).json({
    success: true,
    data: canvas,
  });
}

export async function remove(req: Request, res: Response) {
  await canvasService.remove(req.user!.userId, req.params.id);
  res.status(204).send();
}
