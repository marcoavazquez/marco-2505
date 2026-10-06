import type { ComponentProps } from "react";

export type IconButtonProps = ComponentProps<"button">;

const baseClassName =
  "inline-flex items-center justify-center rounded-md p-2 text-foreground transition-colors hover:bg-zinc-100 focus:outline-none focus:ring-1 focus:ring-foreground disabled:opacity-50 dark:hover:bg-zinc-800";

export const IconButton = ({ children, className, ...buttonProps }: IconButtonProps) => {
  return (
    <button {...buttonProps} className={`${baseClassName} ${className ?? ""}`.trim()}>
      {children}
    </button>
  )
}