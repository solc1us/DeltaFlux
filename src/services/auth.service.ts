import bcrypt from 'bcrypt';
import { prisma } from '../config/prisma';
import { signToken } from '../utils/jwt.util';
import { AppError } from '../middleware/error.middleware';

// Sesuai roadmap Phase 1 - Authentication Layer 
const SALT_ROUNDS = 12;

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

/**
 * RegisterUser: Menangani pendaftaran user baru di DeltaFlux. 
 * Menggunakan status code 409 untuk konflik email.
 */
export async function registerUser(input: RegisterInput): Promise<AuthResult> {
  const existing = await prisma.user.findUnique({ 
    where: { email: input.email } 
  });

  if (existing) {
    const error = new Error('Email already in use') as AppError;
    error.statusCode = 409;
    throw error;
  }

  // Hashing password sebelum simpan ke DB 
  const password_hash = await bcrypt.hash(input.password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: { 
      name: input.name,
      email: input.email, 
      passwordHash: password_hash 
    },
    select: { id: true, email: true, name: true },
  });

  // Generate JWT Token 
  const token = signToken({ userId: user.id, email: user.email, name: user.name });

  return { user, token };
}

/**
 * LoginUser: Menangani autentikasi user DeltaFlux. 
 * Menggunakan status code 401 untuk kredensial tidak valid.
 */
export async function loginUser(input: LoginInput): Promise<AuthResult> {
  const user = await prisma.user.findUnique({ 
    where: { email: input.email } 
  });

  if (!user) {
    const error = new Error('Invalid email or password') as AppError;
    error.statusCode = 401;
    throw error;
  }

  const valid = await bcrypt.compare(input.password, user.passwordHash);
  if (!valid) {
    const error = new Error('Invalid email or password') as AppError;
    error.statusCode = 401;
    throw error;
  }

  const token = signToken({ userId: user.id, email: user.email, name: user.name });

  return {
  token,
  user: { 
    id: user.id, 
    email: user.email, 
    name: user.name
  },
};
}