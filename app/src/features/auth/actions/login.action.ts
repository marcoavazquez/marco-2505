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
      success: false,
      errors: z.flattenError(error).fieldErrors as Record<string, string[]>,
    }
  }

  try {
    const response = await authService.login(data);

    if (!response.success) {
      return {
        ...prevState,
        success: false,
        errors: response.errors,
      };
    }

    return {
      ...prevState,
      success: true,
      data: { email: "", password: "" }
    }

  } catch (e: unknown) {
    return {
      ...prevState,
      success: false,
      errors: {
        email: [e instanceof Error ? e.message : "Ocurrió un error al iniciar sesión"]
      }
    };
  }
}