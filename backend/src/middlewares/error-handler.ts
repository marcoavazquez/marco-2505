import type { ErrorRequestHandler, RequestHandler, Request, Response, NextFunction } from 'express';
import { buildReponse } from '../utils/operation-response.ts';
import { AppError } from '../utils/app-error.js';
import { config } from '../config/index.js';

export const notFound: RequestHandler = (req: Request, _res, next: NextFunction) => {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
};

export const errorHandler: ErrorRequestHandler = (err, req: Request, res: Response, _next: NextFunction) => {
  const statusCode: number =
    err instanceof AppError ? err.statusCode : (err?.status ?? err?.statusCode ?? 500);
  const isProd = config.env === 'production';

  if (statusCode >= 500) console.error(err);

  const body = req.body ?? {};

  res.status(statusCode).json(buildReponse({
    id: `payment-${body.player_id ?? 'unknown'}-${Date.now()}`,
    transaction_amount: null,
    reference: null,
    player_id: body.player_id ?? null,
    player_email: body.player_email ?? null,
    status: statusCode >= 500 ? 'error' : 'rejected',
    status_details: err.details,
    authorization_code: null,
    date_created: new Date().toISOString()
  }));
};