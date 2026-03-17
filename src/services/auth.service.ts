import bcrypt from 'bcrypt';
import { prisma } from '../config/prisma';
import { signToken } from '../utils/jwt.util';
import { AppError } from '../utils/app.error';

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
    throw new AppError(409, 'Email already in use');
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
    throw new AppError(401, 'Invalid email or password');
  }

  const valid = await bcrypt.compare(input.password, user.passwordHash);
  if (!valid) {
    throw new AppError(401, 'Invalid email or password');
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