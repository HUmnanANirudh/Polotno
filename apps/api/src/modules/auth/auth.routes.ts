import { Router } from 'express';
import { registerSchema, loginSchema } from '@polotno/types';
import { validate } from '../../middleware/validate.ts';
import { authenticate } from '../../middleware/auth.ts';
import * as authController from './auth.controller.ts';

const router = Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);
router.get('/me', authenticate, authController.me);

export { router as authRoutes };
