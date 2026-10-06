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
    return <div className="flex min-h-screen items-center justify-center text-sm text-secondary">Preparando la pista...</div>
  }

  if (!isAuthenticated) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-canvas text-foreground">
      {children}
    </div>
  );
}
