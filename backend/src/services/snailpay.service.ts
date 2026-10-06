import { type PaymentInput } from '../validators/snailpay.validator.ts';
import { type OperationResult } from '../types/index.ts';
import { validCard } from '../utils/validCard.ts';

export const SnailPayService = {
  processPayment(paymentData: PaymentInput): OperationResult<unknown> {

    const operationId = `payment-${paymentData.playerId}-${Date.now()}`;

    if (!this.validateCard(paymentData)) {
      return {
        status: 'rejected',
        status_details: {
          message: ['La tarjeta fue rechazada'],
        },
        id: operationId,
        transaction_amount: paymentData.transactionAmount,
        reference: `ref-${operationId}`,
        player_id: paymentData.playerId,
        player_email: paymentData.playerEmail,
        date_created: new Date().toISOString()
      }
    }

    return {
      status: 'success',
      status_details: {
        message: ['Pago procesado exitosamente'],
        card_number: [paymentData.cardNumber],
        cvv: [paymentData.cvv]
      },
      authorization_code: 'AUTH-' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0'),
      id: operationId,
      transaction_amount: paymentData.transactionAmount,
      reference: `ref-${operationId}`,
      player_id: paymentData.playerId,
      player_email: paymentData.playerEmail,
      date_created: new Date().toISOString()
    }
  },

  validateCard(paymentData: PaymentInput): boolean {

    return paymentData.cardNumber === validCard.cardNumber &&
      paymentData.expirationDate === validCard.expirationDate &&
      paymentData.cvv === validCard.cvv;
  }
}
