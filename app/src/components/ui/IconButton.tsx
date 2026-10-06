import type { ComponentProps } from "react";

export type IconButtonProps = ComponentProps<"button">;

const baseClassName =
  "inline-flex size-10 shrink-0 items-center justify-center rounded-full p-2 text-secondary transition-colors hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50";

export const IconButton = ({ children, className, ...buttonProps }: IconButtonProps) => {
  return (
    <button {...buttonProps} className={`${baseClassName} ${className ?? ""}`.trim()}>
      {children}
    </button>
  )
}
