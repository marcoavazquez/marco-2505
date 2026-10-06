import z from "zod";
import { DepositDto } from "../dtos";
import { depositService } from "../services";
import { DepositFormState } from "../types";

const UNEXPECTED_ERROR = "Ocurrió un error al procesar el depósito";

export const depositAction = async (
  prevState: DepositFormState,
  formData: FormData
): Promise<DepositFormState> => {

  const data: DepositDto = {
    cardNumber: formData.get("cardNumber") as string,
    expirationDate: formData.get("expirationDate") as string,
    cvv: formData.get("cvv") as string,
    name: formData.get("name") as string,
    transactionAmount: Number(formData.get("amount")),
  }

  const { data: validatedData, error, success } = DepositDto.safeParse(data, {
    error: z.locales.es().localeError,
  });

  if (!success) {
    return {
      ...prevState,
      success: false,
      errors: z.flattenError(error).fieldErrors as Record<string, string[]>,
      data,
    };
  }

  try {
    const response = await depositService.deposit(validatedData);

    if (!response.success) {
      return {
        ...prevState,
        success: false,
        errors: response.errors ?? { general: [response.message] },
        data,
      };
    }

    return {
      ...prevState,
      success: true,
      message: response.message,
      errors: {},
      data,
    };
  } catch {
    return {
      ...prevState,
      success: false,
      errors: { general: [UNEXPECTED_ERROR] },
      data,
    };
  }
};
