import type { Request, Response, NextFunction } from 'express';
import { config } from '../config/index.ts';
import { AppError } from '../utils/app-error.js';

export const checkHealth = (req: Request, res: Response, next: NextFunction) => {
  if (config.chaos || req.headers['x-fail'] == 'true') {
    return next(new AppError('El servicio de pagos no está disponible. Intenta de nuevo más tarde', 503));
  }
  next();
}
