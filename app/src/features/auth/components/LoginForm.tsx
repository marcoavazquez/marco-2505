"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction } from "../actions/login.action";
import { Button, EmailInput, PasswordInput } from "@/components/ui";
import { LoginFormState } from "../types";
import { redirect } from "next/navigation";

const initialState: LoginFormState = {
  data: { email: "", password: "" },
  success: false,
  errors: {}
};


export function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  if (state.success) {
    redirect('/dashboard')
  }

  return (
    <>
      <form action={formAction} className="space-y-4">
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
          autoComplete="current-password"
          disabled={isPending}
          helperText={state.errors?.password?.join(", ")}
          hasError={Boolean(state.errors?.password)}
        />

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Iniciando sesión..." : "Iniciar sesión"}
        </Button>

        <div className="text-center text-sm">
          <p className="mb-1 text-secondary">¿Aún no tienes una cuenta?</p>
          <Link href="/register" className="rounded-sm font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-primary">
            Registrarse
          </Link>
        </div>
      </form>
    </>
  );
}
