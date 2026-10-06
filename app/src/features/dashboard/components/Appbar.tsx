"use client";

import { IconButton } from "@/components/ui/IconButton";
import { LogoutIcon } from "@/components/icons/LogoutIcon";
import { useAuth } from "@/hooks/useAuth";
import { SnailAvatar } from "@/components/ui/SnailAvatar";

export const Appbar = () => {
  const { logout } = useAuth();

  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex min-h-20 max-w-6xl items-center justify-between gap-4 px-4 sm:px-8">
        <div className="flex items-center gap-3">
          <SnailAvatar className="size-10" />
          <div>
            <p className="text-lg font-bold">Snail Racing</p>
            <p className="text-xs text-secondary">Carreras de caracoles</p>
          </div>
        </div>

        <IconButton
          onClick={() => logout()}
          aria-label="Cerrar sesión"
          title="Cerrar sesión"
        >
          <LogoutIcon className="size-5" />
        </IconButton>
      </div>
    </header>
  );
};
