import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { AuthRequest } from '../types';

const router = Router();

router.get('/me', authMiddleware, (req: Request, res: Response) => {
  const authReq = req as AuthRequest;

  if (!authReq.user) {
    return res.status(401).json({ message: 'User not found in request' });
  }

  return res.status(200).json({
    message: 'protected route ok',
    user: authReq.user,
  });
});

export default router;