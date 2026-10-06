import z from "zod";

const CARD_NUMBER_REGEX = /^\d{16}$/;
const EXPIRATION_DATE_REGEX = /^(0[1-9]|1[0-2])\/\d{2}$/;

export const DepositDto = z.object({
  cardNumber: z
    .string()
    .transform((value) => value.replace(/\s+/g, ""))
    .pipe(
      z.string().regex(CARD_NUMBER_REGEX, "El número de tarjeta debe tener 16 dígitos")
    ),
  expirationDate: z.string().regex(
    EXPIRATION_DATE_REGEX,
    "La fecha de expiración debe tener el formato MM/AA"
  ),
  cvv: z.string().length(3, "El código de seguridad debe tener 3 o 4 dígitos"),
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  transactionAmount: z.coerce.number().positive("El monto debe ser mayor a 0"),
})
  .refine(
    ({ expirationDate }) => {
      if (!EXPIRATION_DATE_REGEX.test(expirationDate)) return true;

      const [month, year] = expirationDate.split("/");
      const expiresAt = new Date(2000 + Number(year), Number(month), 0, 23, 59, 59);

      return expiresAt.getTime() >= Date.now();
    },
    {
      message: "La tarjeta está expirada",
      path: ["expirationDate"],
    }
  )

export type DepositDto = z.infer<typeof DepositDto>
