import { FormState } from "@/types";
import { LoginDto, RegisterDto } from "../dtos";

export type RegisterFormState = FormState<RegisterDto>;

export type LoginFormState = FormState<LoginDto>;
