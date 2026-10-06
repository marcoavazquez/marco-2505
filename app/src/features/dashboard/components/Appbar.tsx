"use client";

import { IconButton } from "@/components/ui/IconButton";
import { LogoutIcon } from "@/components/icons/LogoutIcon";
import { useAuth } from "@/hooks/useAuth";

export const Appbar = () => {
  const { logout } = useAuth();

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-background px-6">
      <h1 className="text-lg font-semibold tracking-tight">Dashboard</h1>

      <IconButton
        onClick={() => logout()}
        aria-label="Cerrar sesión"
        className="text-zinc-500 hover:bg-zinc-100 hover:text-foreground dark:text-zinc-400 dark:hover:bg-zinc-800"
      >
        <LogoutIcon className="size-5" />
      </IconButton>
    </header>
  );
};
