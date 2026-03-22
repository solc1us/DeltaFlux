import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

/**
 * Universal Validation Middleware
 * Memastikan request body, query, atau params sesuai dengan Zod Schema.
 */

export const validate = <T extends z.ZodType>(schema: T) => 
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          errors: error.issues.map((err) => ({
            path: err.path[1] || err.path[0],
            message: err.message,
          })),
        });
      }
      return next(error);
    }
  };