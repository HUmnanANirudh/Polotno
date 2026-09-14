import { Router } from 'express';
import { createCanvasSchema, updateCanvasSchema, mongoIdSchema } from '@polotno/types';
import { validate } from '../../middleware/validate.ts';
import { authenticate } from '../../middleware/auth.ts';
import * as canvasController from './canvas.controller.ts';
import { AppError } from '../../lib/app-error.ts';

const router = Router();

router.use(authenticate); // All canvas routes require auth

router.param('id', (req, _res, next, id) => {
  const result = mongoIdSchema.safeParse(id);
  if (!result.success) {
    return next(new AppError(400, 'Invalid Canvas ID format'));
  }
  next();
});

router.post('/', validate(createCanvasSchema), canvasController.create);
router.get('/', canvasController.findAll);
router.get('/:id', canvasController.findById);
router.put('/:id', validate(updateCanvasSchema), canvasController.update);
router.delete('/:id', canvasController.remove);

export { router as canvasRoutes };
