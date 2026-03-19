import { Router, Response } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { AuthenticatedRequest } from '../types';

const router = Router();

router.get('/me', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ 
      status: 'error',
      message: 'User not found in request' 
    });
  }

  return res.status(200).json({
    status: 'success',
    data: { user }
  });
});

export default router;