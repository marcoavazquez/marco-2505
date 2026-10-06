import React from "react";
import { SnailAvatar } from "@/components/ui/SnailAvatar";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-canvas px-4 py-10">
      <div className="flex items-center gap-3">
        <SnailAvatar className="size-14" />
        <div>
          <p className="text-2xl font-bold">Snail</p>
          <p className="text-sm text-secondary">Carreras de caracoles</p>
        </div>
      </div>
      {children}
      <p className="text-xs text-secondary">La emoción va a su propio ritmo.</p>
    </main>
  );
}
