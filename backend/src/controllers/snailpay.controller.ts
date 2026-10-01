import { type Request, type Response } from 'express';
import { SnailPayService } from '../services/snailpay.service.ts';
import { sendOperation } from '../utils/operation-response.ts';

export const SnailPayController = {
  pay(req: Request, res: Response) {
    const result = SnailPayService.processPayment(req.body);
    sendOperation(req, res, 200, result);
  }
}