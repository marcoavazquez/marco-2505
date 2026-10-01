import { z } from 'zod';

export const paymentSchema = z.object({
  cardNumber: z.string().min(12).max(19),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/, 'Invalid expiry date format'),
  cvv: z.string().min(3).max(4),
  transaction_amount: z.number().positive(),
  playerId: z.string().min(1),
  playerEmail: z.email(),
})

export type PaymentInput = z.infer<typeof paymentSchema>;