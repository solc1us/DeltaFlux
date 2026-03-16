import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.get('/me', authMiddleware, (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'User not found in request' });
  }

  return res.status(200).json({
    message: 'protected route ok',
    user: req.user,
  });
});

export default router;