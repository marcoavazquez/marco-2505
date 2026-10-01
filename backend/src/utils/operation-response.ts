import type { Request, Response } from 'express';
import type { OperationResult } from '../types/index.ts';

export const buildReponse = <T>(result: OperationResult<T>): OperationResult<T> => {
  return {
    id: result.id,
    status_details: result.status_details,
    transaction_amount: result.transaction_amount ?? null,
    date_created: result.date_created ?? new Date().toISOString(),
    reference: result.reference ?? null,
    player_id: result.player_id ?? null,
    player_email: result.player_email ?? null,
    status: result.status,
    authorization_code: result.authorization_code ?? null
  }
}

export const sendOperation = (req: Request, res: Response, httpStatus: number, result: OperationResult<unknown>): void => {
  res.status(httpStatus).json(buildReponse(result))
}