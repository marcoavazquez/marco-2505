import { z } from 'zod';

export const paymentSchema = z.object({
  cardNumber: z.string().length(16),
  expirationDate: z.string().regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, 'Invalid expiry date format'),
  cvv: z.string().length(3),
  transactionAmount: z.number().positive(),
  playerId: z.string().min(1),
  playerEmail: z.email(),
})

export type PaymentInput = z.infer<typeof paymentSchema>;