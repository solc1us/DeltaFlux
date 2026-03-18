import jwt from 'jsonwebtoken';
import { AuthPayload } from '../types';

export type JwtPayload = {
  id: string;
  username: string;
  email: string;
  name: string;
};

const JWT_SECRET = process.env.JWT_SECRET || '';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not set');
}

export const signToken = (payload: AuthPayload) => {
  return jwt.sign(payload, JWT_SECRET, { 
    expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn']
  } as jwt.SignOptions);
}

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}