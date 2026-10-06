"use client";

import { useEffect } from "react";
import { CloseIcon } from "@/components/icons/CloseIcon";

export type SnackbarVariant = "danger" | "success";

export interface SnackbarProps {
  message?: string | null;
  variant?: SnackbarVariant;
  duration?: number;
  onClose?: () => void;
}

const variantClasses: Record<SnackbarVariant, string> = {
  danger: "border-danger bg-danger text-white",
  success: "border-success bg-success text-white",
};

const variantRoles: Record<SnackbarVariant, "alert" | "status"> = {
  danger: "alert",
  success: "status",
};

export function Snackbar({
  message,
  variant = "success",
  duration = 5000,
  onClose,
}: SnackbarProps) {
  useEffect(() => {
    if (!message || !onClose) return;

    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div
      role={variantRoles[variant]}
      className={`fixed bottom-4 right-4 z-50 flex max-w-sm items-start gap-3 rounded-lg border px-4 py-3 text-sm font-medium shadow-lg ${variantClasses[variant]}`}
    >
      <p className="flex-1">{message}</p>
      {onClose && (
        <button
          type="button"
          aria-label="Cerrar notificación"
          onClick={onClose}
          className="rounded p-1 text-white/90 transition-colors hover:bg-white/20 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/70"
        >
          <CloseIcon className="size-4" />
        </button>
      )}
    </div>
  );
}
