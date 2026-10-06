import { z } from 'zod';

export const paymentSchema = z.object({
  cardNumber: z.string().length(16, 'El número de tarjeta debe tener 16 dígitos'),
  expirationDate: z.string().regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, 'La fecha de expiración debe tener el formato MM/AA'),
  cvv: z.string().length(3, 'El código de seguridad debe tener 3 dígitos'),
  transactionAmount: z.number().positive('El monto debe ser mayor a 0'),
  playerId: z.string().min(1, 'El identificador del jugador es obligatorio'),
  playerEmail: z.email('Ingresa un correo electrónico válido'),
})

export type PaymentInput = z.infer<typeof paymentSchema>;
