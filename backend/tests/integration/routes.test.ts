import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import app from '../../src/app.ts';
import { config } from '../../src/config/index.ts';
import { validCard } from '../../src/utils/validCard.ts';

describe('Routes', () => {
  let server: Server;
  let baseUrl: string;

  const validPaymentPayload = {
    transactionAmount: 199.99,
    playerId: 'player-int-001',
    playerEmail: 'gamer@example.com',
    ...validCard
  };

  before(async () => {
    await new Promise<void>((resolve) => {
      server = app.listen(0, () => {
        const address = server.address() as AddressInfo;
        baseUrl = `http://127.0.0.1:${address.port}`;
        resolve();
      });
    });
  });

  after(async () => {
    await new Promise<void>((resolve) => {
      server.close(() => resolve());
    });
  });


  describe('POST /snailpay/pay', () => {
    it('should process a valid payment and return 200 with success operation result', async () => {
      const response = await fetch(`${baseUrl}/snailpay/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validPaymentPayload)
      });

      assert.equal(response.status, 200);
      const data = await response.json();

      assert.equal(data.status, 'success');
      assert.equal(data.player_id, validPaymentPayload.playerId);
      assert.equal(data.player_email, validPaymentPayload.playerEmail);
      assert.equal(data.transaction_amount, validPaymentPayload.transactionAmount);
      assert.match(data.id, new RegExp(`^payment-${validPaymentPayload.playerId}-\\d+$`));
      assert.equal(data.reference, `ref-${data.id}`);
      assert.match(data.authorization_code, /^AUTH-\d{6}$/);
      assert.ok(data.date_created);
    });

    it('should return 400 when body is empty', async () => {
      const response = await fetch(`${baseUrl}/snailpay/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });

      assert.equal(response.status, 400);
      const data = await response.json();

      assert.equal(data.status, 'rejected');
      assert.ok(Array.isArray(data.status_details));
      assert.ok(data.status_details.length > 0);
    });

    it('should return 400 when cardNumber is too short', async () => {
      const response = await fetch(`${baseUrl}/snailpay/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...validPaymentPayload,
          cardNumber: '10'
        })
      });

      assert.equal(response.status, 400);
      const data = await response.json();
      assert.equal(data.status, 'rejected');

      const cardIssue = data.status_details.find((d: any) => d.field === 'cardNumber');
      assert.ok(cardIssue);
    });

    it('should return 400 when expirationDate format is invalid', async () => {
      const response = await fetch(`${baseUrl}/snailpay/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...validPaymentPayload,
          expirationDate: '13/28'
        })
      });

      assert.equal(response.status, 400);
      const data = await response.json();
      assert.equal(data.status, 'rejected');

      const expiryIssue = data.status_details.find((d: any) => d.field === 'expirationDate');
      assert.ok(expiryIssue);
    });

    it('should return 400 when transactionAmount is negative or zero', async () => {
      const response = await fetch(`${baseUrl}/snailpay/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...validPaymentPayload,
          transactionAmount: -10
        })
      });

      assert.equal(response.status, 400);
      const data = await response.json();
      assert.equal(data.status, 'rejected');

      const amountIssue = data.status_details.find((d: any) => d.field === 'transactionAmount');
      assert.ok(amountIssue);
    });

    it('should return 400 when playerEmail is not a valid email', async () => {
      const response = await fetch(`${baseUrl}/snailpay/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...validPaymentPayload,
          playerEmail: 'not-an-email'
        })
      });

      assert.equal(response.status, 400);
      const data = await response.json();
      assert.equal(data.status, 'rejected');

      const emailIssue = data.status_details.find((d: any) => d.field === 'playerEmail');
      assert.ok(emailIssue);
    });
  });

  describe('Public /api prefix', () => {
    it('should process a valid payment at /api/snailpay/pay', async () => {
      const response = await fetch(`${baseUrl}/api/snailpay/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validPaymentPayload)
      });

      assert.equal(response.status, 200);
      const data = await response.json();

      assert.equal(data.status, 'success');
      assert.equal(data.player_id, validPaymentPayload.playerId);
    });

    it('should expose health at /api/health', async () => {
      const response = await fetch(`${baseUrl}/api/health`);

      assert.equal(response.status, 200);
      const data = await response.json();

      assert.equal(data.status, 'ok');
    });

    it('should still return 404 for unknown routes under /api', async () => {
      const response = await fetch(`${baseUrl}/api/unknown`);

      assert.equal(response.status, 404);
    });
  });

  describe('Route Not Found (404)', () => {

    it('should return 404 for undefined POST routes', async () => {
      const response = await fetch(`${baseUrl}/api/unknown`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ foo: 'bar' })
      });
      assert.equal(response.status, 404);
    });
  });

  describe('Security and Middleware headers', () => {
    it('should include Helmet security headers in responses', async () => {
      const response = await fetch(`${baseUrl}/snailpay/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validPaymentPayload)
      });
      assert.ok(response.headers.has('x-content-type-options'));
      assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
    });

    it('should include CORS headers in responses', async () => {
      const response = await fetch(`${baseUrl}/snailpay/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validPaymentPayload)
      });
      assert.ok(response.headers.has('access-control-allow-origin'));
    });
  });

  describe('Chaos Middleware Integration', () => {
    it('should return 503 Service unavailable when chaos mode is enabled', async () => {
      const originalChaos = config.chaos;
      (config as any).chaos = true;

      try {
        const response = await fetch(`${baseUrl}/snailpay/pay`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(validPaymentPayload)
        });
        assert.equal(response.status, 503);

        const data = await response.json();
        assert.equal(data.status, 'error');
      } finally {
        (config as any).chaos = originalChaos;
      }
    });
  });
});
