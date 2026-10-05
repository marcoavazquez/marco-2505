"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerAction } from "../actions/login.action";
import { RegisterFormState } from "../types";

const initialState: RegisterFormState = {
  data: {
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  },
  status: "idle",
  message: "",
  errors: {}
};

export function RegisterForm() {

  const [state, formAction, isPending] = useActionState(registerAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      {state.errors?.general && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
          {state.errors.general}
        </div>
      )}

      <div>
        <label htmlFor="fullName" className="block text-sm font-medium mb-1">
          Nombre completo
        </label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          autoComplete="name"
          disabled={isPending}
          className="w-full px-3 py-2 border rounded-md text-sm outline-none focus:ring-1 focus:ring-black"
        />
        {state.errors?.fullName && (
          <p className="mt-1 text-xs text-red-600">{state.errors.fullName}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Correo electrónico
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          disabled={isPending}
          className="w-full px-3 py-2 border rounded-md text-sm outline-none focus:ring-1 focus:ring-black"
        />
        {state.errors?.email && (
          <p className="mt-1 text-xs text-red-600">{state.errors.email}</p>
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
          autoComplete="new-password"
          disabled={isPending}
          className="w-full px-3 py-2 border rounded-md text-sm outline-none focus:ring-1 focus:ring-black"
        />
        {state.errors?.password && (
          <p className="mt-1 text-xs text-red-600">{state.errors.password}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium mb-1"
        >
          Confirmar contraseña
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          disabled={isPending}
          className="w-full px-3 py-2 border rounded-md text-sm outline-none focus:ring-1 focus:ring-black"
        />
        {state.errors?.confirmPassword && (
          <p className="mt-1 text-xs text-red-600">{state.errors.confirmPassword}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-2 px-4 bg-black text-white text-sm font-medium rounded-md hover:bg-zinc-800 disabled:opacity-50"
      >
        {isPending ? "Registrando..." : "Registrarse"}
      </button>

      <div className="text-center text-sm">
        <Link href="/login" className="text-blue-600 hover:underline">
          Iniciar Sesión
        </Link>
      </div>
    </form>
  );
}
