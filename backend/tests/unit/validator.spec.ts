import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { paymentSchema, type PaymentInput } from '../../src/validators/snailpay.validator.ts';

describe('Snailpay Validator', () => {
  const validPaymentData: PaymentInput = {
    cardNumber: '1234123412341234',
    expiryDate: '12/26',
    cvv: '543',
    transaction_amount: 150.75,
    playerId: 'player-456',
    playerEmail: 'player@example.com'
  };

  describe('paymentSchema Validator', () => {
    it('should validate a valid payment payload successfully', () => {
      const result = paymentSchema.safeParse(validPaymentData);
      assert.equal(result.success, true);
      if (result.success) {
        assert.deepEqual(result.data, validPaymentData);
      }
    });

    describe('cardNumber validation', () => {
      it('should accept card numbers with length of 16 digits', () => {
        const result = paymentSchema.safeParse(validPaymentData);
        assert.equal(result.success, true);
      });

      it('should reject card numbers with length less than 16 digits', () => {
        const result = paymentSchema.safeParse({
          ...validPaymentData,
          cardNumber: '12345678901'
        });
        assert.equal(result.success, false);
      });

      it('should reject card numbers with length more than 16 digits', () => {
        const result = paymentSchema.safeParse({
          ...validPaymentData,
          cardNumber: '12341234123412341'
        });
        assert.equal(result.success, false);
      });
    });

    describe('expiryDate validation', () => {
      it('should accept MM/YY format', () => {
        const result = paymentSchema.safeParse({
          ...validPaymentData,
          expiryDate: '08/29'
        });
        assert.equal(result.success, true);
      });

      it('should reject MM/YYYY format', () => {
        const result = paymentSchema.safeParse({
          ...validPaymentData,
          expiryDate: '01/2032'
        });
        assert.equal(result.success, false);
      });

      it('should reject MMYY format', () => {
        const result = paymentSchema.safeParse({
          ...validPaymentData,
          expiryDate: '0125'
        });
        assert.equal(result.success, false);
      });

      it('should reject invalid month (e.g. 00 or 13)', () => {
        const resultMonth00 = paymentSchema.safeParse({
          ...validPaymentData,
          expiryDate: '00/28'
        });
        assert.equal(resultMonth00.success, false);

        const resultMonth13 = paymentSchema.safeParse({
          ...validPaymentData,
          expiryDate: '13/28'
        });
        assert.equal(resultMonth13.success, false);
      });

      it('should reject malformed expiry date format', () => {
        const result = paymentSchema.safeParse({
          ...validPaymentData,
          expiryDate: '2027/09'
        });
        assert.equal(result.success, false);
      });
    });

    describe('cvv validation', () => {
      it('should accept 3-digit CVV', () => {
        const result = paymentSchema.safeParse({
          ...validPaymentData,
          cvv: '999'
        });
        assert.equal(result.success, true);
      });

      it('should reject CVV with less than 3 digits', () => {
        const result = paymentSchema.safeParse({
          ...validPaymentData,
          cvv: '12'
        });
        assert.equal(result.success, false);
      });

      it('should reject CVV with more than 3 digits', () => {
        const result = paymentSchema.safeParse({
          ...validPaymentData,
          cvv: '1234'
        });
        assert.equal(result.success, false);
      });
    });

    describe('transaction_amount validation', () => {
      it('should reject zero as transaction amount', () => {
        const result = paymentSchema.safeParse({
          ...validPaymentData,
          transaction_amount: 0
        });
        assert.equal(result.success, false);
      });

      it('should reject negative transaction amount', () => {
        const result = paymentSchema.safeParse({
          ...validPaymentData,
          transaction_amount: -25.5
        });
        assert.equal(result.success, false);
      });
    });

    describe('playerId validation', () => {
      it('should reject empty playerId', () => {
        const result = paymentSchema.safeParse({
          ...validPaymentData,
          playerId: ''
        });
        assert.equal(result.success, false);
      });
    });

    describe('playerEmail validation', () => {
      it('should reject invalid email format', () => {
        const result = paymentSchema.safeParse({
          ...validPaymentData,
          playerEmail: 'not-an-email'
        });
        assert.equal(result.success, false);
      });
    });
  });
})