import type { Request, Response } from 'express';
import * as authService from './auth.service.ts';

export async function register(req: Request, res: Response) {
  const input = req.body; // Extract params here
  const { user, accessToken, refreshToken } = await authService.register(input);
  
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/api/auth',
  });

  res.status(201).json({
    success: true,
    data: { user, accessToken },
  });
}

export async function login(req: Request, res: Response) {
  const input = req.body; // Extract params here
  const { user, accessToken, refreshToken } = await authService.login(input);
  
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/api/auth',
  });

  res.status(200).json({
    success: true,
    data: { user, accessToken },
  });
}

export async function refresh(req: Request, res: Response) {
  const refreshToken = req.cookies.refreshToken; // Extract from cookies
  if (!refreshToken) {
    res.status(401).json({ success: false, message: 'No refresh token provided' });
    return;
  }

  const { accessToken } = await authService.refresh(refreshToken);
  
  res.status(200).json({
    success: true,
    data: { accessToken },
  });
}

export async function logout(req: Request, res: Response) {
  res.clearCookie('refreshToken', { path: '/api/auth' });
  res.status(200).json({
    success: true,
    message: 'Logged out',
  });
}

export async function me(req: Request, res: Response) {
  const userId = req.user!.userId; // Extract params here
  const user = await authService.getProfile(userId);
  res.status(200).json({
    success: true,
    data: user,
  });
}
