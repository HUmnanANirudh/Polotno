import type { RegisterInput, LoginInput } from '@polotno/types';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../config/prisma.ts';
import { env } from '../../config/env.ts';
import { AppError } from '../../lib/app-error.ts';

function generateTokens(userId: string, email: string) {
  const payload = { userId, email };
  const accessToken = jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
  return { accessToken, refreshToken };
}

export async function register(input: RegisterInput) {
  const existingUser = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (existingUser) {
    throw new AppError(409, 'Email already in use');
  }

  const passwordHash = await bcryptjs.hash(input.password, 12);
  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash,
    },
  });

  const { accessToken, refreshToken } = generateTokens(user.id, user.email);
  const { passwordHash: _ph, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, accessToken, refreshToken };
}

export async function login(input: LoginInput) {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (!user) {
    throw new AppError(401, 'Invalid email or password');
  }

  const isPasswordValid = await bcryptjs.compare(input.password, user.passwordHash);
  if (!isPasswordValid) {
    throw new AppError(401, 'Invalid email or password');
  }

  const { accessToken, refreshToken } = generateTokens(user.id, user.email);
  const { passwordHash: _ph, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, accessToken, refreshToken };
}

export async function refresh(refreshToken: string) {
  try {
    const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as { userId: string; email: string };
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      throw new AppError(401, 'User not found');
    }

    const tokens = generateTokens(user.id, user.email);
    return { accessToken: tokens.accessToken };
  } catch (error) {
    throw new AppError(401, 'Invalid or expired refresh token');
  }
}

export async function getProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError(404, 'User not found');
  }

  const { passwordHash: _ph, ...userWithoutPassword } = user;
  return userWithoutPassword;
}
