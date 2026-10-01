import { type Request, type Response, type NextFunction, type RequestHandler } from 'express';
import { ZodType } from 'zod';
import { AppError } from '../utils/app-error.js';

export const validate = (schema: ZodType): RequestHandler => (req: Request, res: Response, next: NextFunction) => {

  const result = schema.safeParse(req.body);

  if (!result.success) {
    const details = result.error.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }))
    return next(new AppError('Validation failed', 400, details));
  }

  req.body = result.data;
  next();
}