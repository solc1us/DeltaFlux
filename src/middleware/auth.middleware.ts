import { Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.util';
import { AuthPayload, AuthenticatedRequest } from '../types';
import { AppError } from '../utils/app.error';

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  // 1. Cek format Bearer Token
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError(401, 'Unauthorized: No token provided'));
  }

  const token = authHeader.split(' ')[1]!; // Ambil token setelah 'Bearer '

  try {
    // 2. Verify Token & Cast ke AuthPayload yang ada username-nya
    const payload = verifyToken(token) as AuthPayload;

    // 3. Inject ke req.user. 
    // Karena express.d.ts lu pake tipe 'User' dari Prisma, 
    // kita pastiin object-nya punya property yang minimal dibutuhin.
    req.user = {
      id: payload.id,
      username: payload.username,
      email: payload.email,
      name: payload.name,
    };

    next();
  } catch {
    // 4. Lempar ke Global Error Handler
    next(new AppError(401, 'Invalid or expired token'));
  }
};