import { z } from 'zod';

const baseElementFields = {
  id: z.string(),
  x: z.number(),
  y: z.number(),
  width: z.number().nonnegative(),
  height: z.number().nonnegative(),
  rotation: z.number().default(0),
  zIndex: z.number().int().default(0),
  opacity: z.number().min(0).max(1).default(1),
};

export const rectangleElementSchema = z.object({
  ...baseElementFields,
  type: z.literal('rectangle'),
  fill: z.string().default('#cccccc'),
  stroke: z.string().optional(),
  strokeWidth: z.number().optional(),
  cornerRadius: z.number().optional(),
});

export const circleElementSchema = z.object({
  ...baseElementFields,
  type: z.literal('circle'),
  fill: z.string().default('#cccccc'),
  stroke: z.string().optional(),
  strokeWidth: z.number().optional(),
});

export const textElementSchema = z.object({
  ...baseElementFields,
  type: z.literal('text'),
  text: z.string().default('Text'),
  fontSize: z.number().default(24),
  fontFamily: z.string().default('Arial'),
  fill: z.string().default('#000000'),
  fontStyle: z.string().optional(),
  align: z.enum(['left', 'center', 'right']).default('left'),
});

export const imageElementSchema = z.object({
  ...baseElementFields,
  type: z.literal('image'),
  src: z.string().url(),
});

export const lineElementSchema = z.object({
  ...baseElementFields,
  type: z.literal('line'),
  points: z.array(z.number()),
  stroke: z.string().default('#000000'),
  strokeWidth: z.number().default(2),
  pointerAtEnd: z.boolean().default(false),
});

export const canvasElementSchema = z.discriminatedUnion('type', [
  rectangleElementSchema,
  circleElementSchema,
  textElementSchema,
  imageElementSchema,
  lineElementSchema,
]);

export const createCanvasSchema = z.object({
  name: z.string().min(1).max(200),
  width: z.number().int().min(100).max(5000).default(1920),
  height: z.number().int().min(100).max(5000).default(1080),
});

export const updateCanvasSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  width: z.number().int().min(100).max(5000).optional(),
  height: z.number().int().min(100).max(5000).optional(),
  elements: z.array(canvasElementSchema).optional(),
  thumbnail: z.string().url().optional().nullable(),
});

export type RectangleElement = z.infer<typeof rectangleElementSchema>;
export type CircleElement = z.infer<typeof circleElementSchema>;
export type TextElement = z.infer<typeof textElementSchema>;
export type ImageElement = z.infer<typeof imageElementSchema>;
export type LineElement = z.infer<typeof lineElementSchema>;

export type CanvasElement = z.infer<typeof canvasElementSchema>;

export type CreateCanvasInput = z.infer<typeof createCanvasSchema>;
export type UpdateCanvasInput = z.infer<typeof updateCanvasSchema>;

export type CanvasResponse = {
  id: string;
  name: string;
  width: number;
  height: number;
  elements: CanvasElement[];
  thumbnail: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
};
