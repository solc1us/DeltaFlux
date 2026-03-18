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
    // Destructuring username juga dari body
    const { name, username, email, password } = req.body;

    // Gak perlu if (!email...) lagi karena udah dicek Zod di route
    const result = await authService.registerUser({ name, username, email, password });
    
    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      data: result
    });
  } catch (err) {
    next(err); 
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
    const { username, password } = req.body;

    const result = await authService.loginUser({ username, password });

    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: result
    });
  } catch (err) {
    next(err);
  }
}