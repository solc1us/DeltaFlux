// src/middleware/auth.middleware.ts
import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AuthRequest, AuthPayload } from '../types';

export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.slice(7)
    : undefined;

  if (!token) {
    res.status(401).json({ message: 'No token provided' });
    return;
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret) as AuthPayload;
    req.user = payload;
    next();
  } catch (err) {
    console.error('JWT verification failed:', err instanceof Error ? err.message : err);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
}
