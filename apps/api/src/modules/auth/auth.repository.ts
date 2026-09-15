import { UserModel } from './user.model.ts';
import type { RegisterInput } from '@polotno/types';

export async function findByEmail(email: string) {
  const user = await UserModel.findOne({ email });
  return user ? Object.assign(user.toJSON(), { id: user._id.toString() }) : null;
}

export async function findById(id: string) {
  const user = await UserModel.findById(id);
  return user ? Object.assign(user.toJSON(), { id: user._id.toString() }) : null;
}

export async function create(data: { name: string; email: string; passwordHash: string }) {
  const user = await UserModel.create(data);
  return Object.assign(user.toJSON(), { id: user._id.toString() });
}
