import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';

/**
 * Handle Registrasi User DeltaFlux
 * Route: POST /api/auth/register
 */
export async function register(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { name, email, password } = req.body;

    // Validasi dasar sebelum masuk service (Nanti diganti Zod di Phase 2)
    if (!email || !password || !name) {
      res.status(400).json({ message: 'Name, email, and password are required' });
      return;
    }

    const result = await authService.registerUser({ name, email, password });
    
    res.status(201).json({
      status: 'success',
      data: result
    });
  } catch (err) {
    next(err); // Dilempar ke Global Error Middleware
  }
}

/**
 * Handle Login User DeltaFlux
 * Route: POST /api/auth/login
 */
export async function login(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }

    const result = await authService.loginUser({ email, password });

    res.status(200).json({
      status: 'success',
      data: result
    });
  } catch (err) {
    next(err); // Dilempar ke Global Error Middleware
  }
}