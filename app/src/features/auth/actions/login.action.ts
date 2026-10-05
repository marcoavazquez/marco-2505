import z from "zod";
import { LoginDto } from "../dtos";
import { authService } from "../services";
import { LoginFormState } from "../types";

export const loginAction = async (
  prevState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> => {

  const { data, error, success } = LoginDto.safeParse(Object.fromEntries(formData.entries()));

  if (!success) {
    return {
      ...prevState,
      status: "error",
      message: "Error al iniciar sesión",
      errors: z.flattenError(error).fieldErrors as Record<string, string[]>,
    }
  }

  try {
    const response = await authService.login(data);

    if (!response.success) {
      return {
        ...prevState,
        status: "error",
        message: response.message || "Credenciales incorrectas",
      };
    }

    return {
      data,
      status: "success",
      message: response.message,
    };
  } catch {
    return {
      ...prevState,
      status: "error",
      message: "Ocurrió un error al iniciar sesión",
    };
  }
}