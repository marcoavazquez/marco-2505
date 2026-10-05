"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button, EmailInput, PasswordInput, TextInput } from "@/components/ui";
import { registerAction } from "../actions/register.action";
import { RegisterFormState } from "../types";

const initialState: RegisterFormState = {
  data: {
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  },
  success: false,
  errors: {}
};

export function RegisterForm() {

  const [state, formAction, isPending] = useActionState(registerAction, initialState);

  return (
    <form action={formAction} className="space-y-4" noValidate>

      <TextInput
        id="fullName"
        name="fullName"
        label="Nombre completo"
        autoComplete="name"
        disabled={isPending}
        helperText={state.errors?.fullName?.join(", ")}
        hasError={Boolean(state.errors?.fullName)}
      />

      <EmailInput
        id="email"
        name="email"
        label="Correo electrónico"
        autoComplete="email"
        disabled={isPending}
        helperText={state.errors?.email?.join(", ")}
        hasError={Boolean(state.errors?.email)}
      />

      <PasswordInput
        id="password"
        name="password"
        label="Contraseña"
        autoComplete="new-password"
        disabled={isPending}
        helperText={state.errors?.password?.join(", ")}
        hasError={Boolean(state.errors?.password)}
      />

      <PasswordInput
        id="confirmPassword"
        name="confirmPassword"
        label="Confirmar contraseña"
        autoComplete="new-password"
        disabled={isPending}
        helperText={state.errors?.confirmPassword?.join(", ")}
        hasError={Boolean(state.errors?.confirmPassword)}
      />

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Registrando..." : "Registrarse"}
      </Button>

      <div className="text-center text-sm">
        <Link href="/login" className="text-blue-600 hover:underline">
          Iniciar Sesión
        </Link>
      </div>
    </form>
  );
}
