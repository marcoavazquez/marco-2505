import type { Request, Response, NextFunction } from 'express';
import { config } from '../config/index.ts';
import { AppError } from '../utils/app-error.js';

export const checkHealth = (req: Request, res: Response, next: NextFunction) => {
  console.log('config', config)
  if (config.chaos) {
    return next(new AppError('Service unavailable', 503));
  }
  next();
}