import React from "react";
import { LoginForm } from "./LoginForm";

export function LoginView() {
  return (
    <div className="w-full max-w-sm p-6 border rounded-lg shadow-sm bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
      <h1 className="text-xl font-bold mb-6 text-center">Iniciar Sesión</h1>
      <LoginForm />
    </div>
  );
}
