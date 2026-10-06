import z from "zod";
import { RegisterDto } from "../dtos";
import { authService } from "../services";
import { RegisterFormState } from "../types";
import { redirect } from "next/navigation";

export const registerAction = async (
  prevState: RegisterFormState,
  form: FormData
): Promise<RegisterFormState> => {

  const data = {
    fullName: form.get("fullName")?.toString() ?? "",
    email: form.get("email")?.toString() ?? "",
    password: form.get("password")?.toString() ?? "",
    confirmPassword: form.get("confirmPassword")?.toString() ?? "",
  }

  const { data: validatedData, error, success } = RegisterDto.safeParse(data);

  if (!success) {
    return {
      ...prevState,
      success: false,
      errors: z.flattenError(error).fieldErrors,
      data,
    }
  }

  try {
    const response = await authService.register(validatedData);

    if (!response.success) {

      return {
        ...prevState,
        success: false,
        errors: response.errors,
        data,
      };
    }

    return {
      ...prevState,
      success: true,
      data: { email: "", password: "", fullName: "", confirmPassword: "" }
    }
  } catch {
    return {
      ...prevState,
      success: false,
      errors: { general: ["Ocurrió un error al registrar la cuenta"] },
      data
    };
  }
};
