import z from "zod";
import { RegisterDto } from "../dtos";
import { authService } from "../services";
import { RegisterFormState } from "../types";

export const registerAction = async (
  prevState: RegisterFormState,
  formData: FormData
): Promise<RegisterFormState> => {

  const { data, error, success } = RegisterDto.safeParse(Object.fromEntries(formData.entries()));

  if (!success) {
    return {
      ...prevState,
      status: "error",
      message: "Error al registrarse",
      errors: z.flattenError(error).fieldErrors as Record<string, string[]>,
    };
  }

  try {
    const response = await authService.register(data);

    if (!response.success) {
      return {
        errors: {
          general: response.message || "Error al registrarse",
        },
      };
    }

    return { success: true };
  } catch {
    return {
      errors: {
        general: "Ocurrió un error al registrar la cuenta",
      },
    };
  }
}