import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/app.error';

/**
 * Global Error Middleware
 * Menangani semua error dari controller secara terpusat.
 */
export function errorMiddleware(
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  let statusCode = 500;
  let message = 'Internal Server Error';

  // 1. Identifikasi tipe error
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if ((err as { name: string }).name === 'ValidationError') {
    // Handle error dari validator jika tidak lewat ZodMiddleware
    statusCode = 400;
    message = err.message;
  }

  // 2. Logging yang informatif tapi rapi
  // Pakai ISO String biar tau kapan error terjadi di log file
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] ERROR: ${req.method} ${req.path}`);
  console.error(`Message: ${err.message}`);
  
  // 3. Response format standardized
      res.status(statusCode).json({
        status: statusCode >= 500 ? 'fail' : 'error',
        message: statusCode >= 500 && process.env.NODE_ENV === 'production' 
          ? 'Internal Server Error' // Jangan kasih pesan asli DB ke user di prod
          : message,
        // Stack trace HANYA untuk development
        ...(process.env.NODE_ENV === 'development' && { 
          stack: err.stack,
          details: err instanceof AppError ? undefined : err 
        }),
  });
}