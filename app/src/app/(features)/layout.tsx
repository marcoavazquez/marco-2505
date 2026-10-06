"use client";

import { useAuth } from "@/hooks/useAuth";
import { redirect } from "next/navigation";

export default function FeaturesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Cargando...</div>
  }

  if (!isAuthenticated) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100">
      {children}
    </div>
  );
}
