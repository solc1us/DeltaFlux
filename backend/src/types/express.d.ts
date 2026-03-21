import type { User } from '@prisma/client';
import type { AuthPayload } from './index';

declare global {
  namespace Express {
    interface Request {
      user?: User | AuthPayload;
    }
  }
}

export {};