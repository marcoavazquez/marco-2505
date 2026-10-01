import type { ErrorRequestHandler, RequestHandler } from 'express';
import { AppError } from '../utils/app-error.js';
import { config } from '../config/index.js';

export const notFound: RequestHandler = (req, _res, next) => {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const statusCode: number =
    err instanceof AppError ? err.statusCode : (err?.status ?? err?.statusCode ?? 500);
  const isProd = config.env === 'production';

  if (statusCode >= 500) console.error(err);

  res.status(statusCode).json({
    status: 'error',
    message:
      statusCode >= 500 && isProd ? 'Internal server error' : (err?.message ?? 'Unknown error'),
    ...(err instanceof AppError && err.details !== undefined && { details: err.details }),
    ...(!isProd && { stack: err?.stack }),
  });
};