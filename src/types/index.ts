// src/types/index.ts
import { Request } from 'express';

export interface AuthPayload {
  id: string;
  name: string;
  email: string;
}

export interface AuthRequest extends Request {
  user?: AuthPayload;
}
