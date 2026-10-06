"use client";

import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";

interface Props {

}

export const Appbar = () => {
  const { logout, user } = useAuth()

  return (
    <div className="flex items-center justify-between px-6 h-16 border-b border-gray-200">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold">Dashboard</h1>
      </div>

      <div className="flex items-center gap-4">
        <span className="font-bold text-xl text-green-600">10,001.32 MXN</span>
        <Button onClick={() => logout()}>Cerrar Sesión</Button>
      </div>
    </div>
  );
};