// src/controllers/auth.controller.ts
import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { name, email, password } = req.body as {
      name: string;
      email: string;
      password: string;
    };
    const result = await authService.registerUser({ name, email, password });
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function login(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email, password } = req.body as {
      email: string;
      password: string;
    };
    const result = await authService.loginUser({ email, password });
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}
