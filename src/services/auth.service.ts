// src/services/auth.service.ts
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { env } from '../config/env';
import { prisma } from '../config/prisma';
import { AppError } from '../middleware/error.middleware';

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResult {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export async function registerUser(input: RegisterInput): Promise<AuthResult> {
  const existing = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (existing) {
    const error: AppError = new Error('Email already in use');
    error.statusCode = 409;
    throw error;
  }

  const passwordHash = await bcrypt.hash(input.password, 12);

  const user = await prisma.user.create({
    data: {
      id: uuidv4(),
      name: input.name,
      email: input.email,
      passwordHash,
    },
  });

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn } as jwt.SignOptions
  );

  return { token, user: { id: user.id, name: user.name, email: user.email } };
}

export async function loginUser(input: LoginInput): Promise<AuthResult> {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (!user) {
    const error: AppError = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const valid = await bcrypt.compare(input.password, user.passwordHash);

  if (!valid) {
    const error: AppError = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn } as jwt.SignOptions
  );

  return { token, user: { id: user.id, name: user.name, email: user.email } };
}
