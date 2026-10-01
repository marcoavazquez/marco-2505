import { type PaymentInput } from '../validators/snailpay.validator.ts';
import { type OperationResult } from '../types/index.ts';

export const SnailPayService = {
  processPayment(paymentData: PaymentInput): OperationResult<unknown> {

    const operationId = `payment-${paymentData.playerId}-${Date.now()}`;

    return {
      status: 'success',
      status_details: {
        message: 'Payment processed successfully'
      },
      authorization_code: 'AUTH-' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0'),
      id: operationId,
      transaction_amount: paymentData.transaction_amount,
      reference: `ref-${operationId}`,
      player_id: paymentData.playerId,
      player_email: paymentData.playerEmail,
      date_created: new Date().toISOString()
    }
  }
}