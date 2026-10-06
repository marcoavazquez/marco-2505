"use client";

import { useId } from "react";
import type { ComponentProps } from "react";

export interface InputProps extends ComponentProps<"input"> {
  label: string;
  helperText?: string;
  hasError?: boolean;
}

const baseClassName =
  "min-h-11 w-full border border-border bg-background px-3 py-2 rounded-lg text-sm text-foreground outline-none transition-colors placeholder:text-secondary/70 focus:border-primary focus:ring-2 focus:ring-primary/20 aria-invalid:border-danger aria-invalid:focus:ring-danger/20 disabled:opacity-50";

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
            hasError ? "text-danger" : "text-secondary"
          }`}
        >
          {helperText}
        </p>
      )}
    </div>
  );
}
