import { prisma } from '../../config/prisma.ts';
import type { RegisterInput } from '@polotno/types';

export async function findByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function findById(id: string) {
  return prisma.user.findUnique({ where: { id } });
}

export async function create(data: { name: string; email: string; passwordHash: string }) {
  return prisma.user.create({ data });
}
