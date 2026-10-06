import z from "zod";
import { RegisterDto } from "../dtos";
import { authService } from "../services";
import { RegisterFormState } from "../types";
import { redirect } from "next/navigation";

export const registerAction = async (
  prevState: RegisterFormState,
  formData: FormData
): Promise<RegisterFormState> => {
  const { data, error, success } = RegisterDto.safeParse(
    Object.fromEntries(formData.entries())
  );

  console.log(data)

  if (!success) {
    return {
      ...prevState,
      success: false,
      errors: z.flattenError(error).fieldErrors
    };
  }

  try {
    const response = await authService.register(data);

    if (!response.success) {

      return {
        ...prevState,
        success: false,
        errors: response.errors,
      };
    }
    redirect('/dashboard')
  } catch {
    return {
      ...prevState,
      success: false,
      errors: { general: ["Ocurrió un error al registrar la cuenta"] },
    };
  }
};
