import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { SnailPayService } from '../../src/services/snailpay.service.ts';
import type { PaymentInput } from '../../src/validators/snailpay.validator.ts';

describe('SnailPay Service', () => {
  const validPaymentData: PaymentInput = {
    cardNumber: '1234123412341234',
    expiryDate: '12/26',
    cvv: '543',
    transaction_amount: 150.75,
    playerId: 'player-456',
    playerEmail: 'player@example.com'
  };

  it('should process payment and return successful OperationResult', () => {
    const result = SnailPayService.processPayment(validPaymentData);

    assert.equal(result.status, 'success');
    assert.deepEqual(result.status_details, {
      message: 'Payment processed successfully'
    });
    assert.equal(result.player_id, validPaymentData.playerId);
    assert.equal(result.player_email, validPaymentData.playerEmail);
    assert.equal(result.transaction_amount, validPaymentData.transaction_amount);
    assert.match(result.id, new RegExp(`^payment-${validPaymentData.playerId}-\\d+$`));
    assert.equal(result.reference, `ref-${result.id}`);
    assert.match(result.authorization_code ?? '', /^AUTH-\d{6}$/);

    const timestamp = Date.parse(result.date_created);
    assert.equal(Number.isNaN(timestamp), false);
  });
});