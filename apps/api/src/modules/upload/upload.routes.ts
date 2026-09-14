import { Router } from 'express';
import { authenticate } from '../../middleware/auth.ts';
import { uploadImage } from '../../middleware/upload.ts';
import * as uploadController from './upload.controller.ts';

const router = Router();

router.use(authenticate);
router.post('/image', uploadImage.single('image'), uploadController.upload);

export { router as uploadRoutes };
