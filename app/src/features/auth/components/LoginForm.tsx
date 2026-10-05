"use client";

import React, { useActionState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LoginDto } from "../dtos";
import { authService } from "../services";

interface LoginFormState {
  errors?: {
    user?: string;
    password?: string;
    general?: string;
  };
  success?: boolean;
}

const initialState: LoginFormState = {};

async function loginAction(
  _prevState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  const user = formData.get("user") as string;
  const password = formData.get("password") as string;

  const validation = LoginDto.safeParse({
    user: (user || "").trim(),
    password: password || "",
  });

  if (!validation.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of validation.error.issues) {
      const fieldName = issue.path[0] as string;
      if (fieldName && !fieldErrors[fieldName]) {
        fieldErrors[fieldName] = issue.message;
      }
    }
    return { errors: fieldErrors };
  }

  try {
    const response = await authService.login(validation.data);

    if (!response.success) {
      return {
        errors: {
          general: response.message || "Credenciales incorrectas",
        },
      };
    }

    return { success: true };
  } catch {
    return {
      errors: {
        general: "Ocurrió un error al iniciar sesión",
      },
    };
  }
}

export function LoginForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  useEffect(() => {
    if (state.success) {
      router.push("/dashboard");
    }
  }, [state.success, router]);

  return (
    <form action={formAction} className="space-y-4" noValidate>
      {state.errors?.general && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
          {state.errors.general}
        </div>
      )}

      <div>
        <label htmlFor="user" className="block text-sm font-medium mb-1">
          Correo electrónico
        </label>
        <input
          id="user"
          name="user"
          type="email"
          autoComplete="email"
          disabled={isPending}
          className="w-full px-3 py-2 border rounded-md text-sm outline-none focus:ring-1 focus:ring-black"
        />
        {state.errors?.user && (
          <p className="mt-1 text-xs text-red-600">{state.errors.user}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-1">
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          disabled={isPending}
          className="w-full px-3 py-2 border rounded-md text-sm outline-none focus:ring-1 focus:ring-black"
        />
        {state.errors?.password && (
          <p className="mt-1 text-xs text-red-600">{state.errors.password}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-2 px-4 bg-black text-white text-sm font-medium rounded-md hover:bg-zinc-800 disabled:opacity-50"
      >
        {isPending ? "Iniciando sesión..." : "Iniciar Sesión"}
      </button>

      <div className="text-center text-sm">
        <Link href="/register" className="text-blue-600 hover:underline">
          Registrarse
        </Link>
      </div>
    </form>
  );
}
