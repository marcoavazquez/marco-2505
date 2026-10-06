"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button, EmailInput, PasswordInput, TextInput } from "@/components/ui";
import { registerAction } from "../actions/register.action";
import { RegisterFormState } from "../types";
import { redirect } from "next/navigation";

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

  if (state.success) {
    redirect('/dashboard')
  }

  return (
    <form action={formAction} className="space-y-4" noValidate>
      <TextInput
        id="fullName"
        name="fullName"
        label="Nombre completo"
        autoComplete="name"
        disabled={isPending}
        defaultValue={state.data.fullName}
        helperText={state.errors?.fullName?.join(", ")}
        hasError={Boolean(state.errors?.fullName)}
      />

      <EmailInput
        id="email"
        name="email"
        label="Correo electrónico"
        autoComplete="email"
        disabled={isPending}
        defaultValue={state.data.email}
        helperText={state.errors?.email?.join(", ")}
        hasError={Boolean(state.errors?.email)}
      />

      <PasswordInput
        id="password"
        name="password"
        label="Contraseña"
        autoComplete="new-password"
        disabled={isPending}
        defaultValue={state.data.password}
        helperText={state.errors?.password?.join(", ")}
        hasError={Boolean(state.errors?.password)}
      />

      <PasswordInput
        id="confirmPassword"
        name="confirmPassword"
        label="Confirmar contraseña"
        autoComplete="new-password"
        disabled={isPending}
        defaultValue={state.data.confirmPassword}
        helperText={state.errors?.confirmPassword?.join(", ")}
        hasError={Boolean(state.errors?.confirmPassword)}
      />

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Registrando..." : "Registrarse"}
      </Button>

      <div className="text-center text-sm">
        <p className="mb-1 text-secondary">¿Ya tienes una cuenta?</p>
        <Link href="/login" className="rounded-sm font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-primary">
          Iniciar sesión
        </Link>
      </div>
    </form>
  );
}
