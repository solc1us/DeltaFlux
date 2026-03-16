import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.util';

/**
 * Auth Middleware: Proteksi route agar hanya bisa diakses user dengan token valid.
 * Sesuai roadmap Phase 1 Order 1.4.
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  // Check format Authorization: Bearer <token>
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ 
      status: 'error',
      message: 'Unauthorized: No token provided' 
    });
    return;
  }

  const token = authHeader.split(' ')[1]!;


  try {
    // Menggunakan utilitas terpusat sesuai Phase 0 setup 
    const payload = verifyToken(token);
    
    // Inject data user ke object request (sudah dikenali via express.d.ts)
    req.user = {
      id: payload.userId,
      name: payload.name,
      email: payload.email,
    };

    next();
  } catch (err) {
    // Log error secara internal tapi berikan pesan standar ke user
    console.error('JWT verification failed:', err instanceof Error ? err.message : err);
    
    res.status(401).json({ 
      status: 'error',
      message: 'Invalid or expired token' 
    });
  }
}