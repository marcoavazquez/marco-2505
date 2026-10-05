"use client";

import { useId } from "react";
import type { ComponentProps } from "react";

export interface InputProps extends ComponentProps<"input"> {
  label: string;
  helperText?: string;
  hasError?: boolean;
}

const baseClassName =
  "w-full px-3 py-2 border rounded-md text-sm outline-none focus:ring-1 focus:ring-black disabled:opacity-50";

export function Input({
  label,
  helperText,
  hasError = false,
  id,
  className,
  ...inputProps
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const helperTextId = helperText ? `${inputId}-helper-text` : undefined;

  return (
    <div className="space-y-1">
      <label htmlFor={inputId} className="block text-sm font-medium">
        {label}
      </label>
      <input
        {...inputProps}
        id={inputId}
        aria-invalid={hasError || undefined}
        aria-describedby={helperTextId}
        className={`${baseClassName} ${className ?? ""}`.trim()}
      />
      {helperText && (
        <p
          id={helperTextId}
          className={`text-xs ${
            hasError ? "text-danger" : "text-zinc-500 dark:text-zinc-400"
          }`}
        >
          {helperText}
        </p>
      )}
    </div>
  );
}
