import type { ComponentProps, ReactNode } from "react";

export type ButtonSize = "sm" | "md" | "lg";
export type ButtonVariant = "solid" | "outlined" | "ghost";
export type ButtonColor = "primary" | "secondary" | "default" | "danger";

export interface ButtonProps extends ComponentProps<"button"> {
  children: ReactNode;
  size?: ButtonSize;
  variant?: ButtonVariant;
  color?: ButtonColor;
}

const baseClassName =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:pointer-events-none";

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

const variantClasses: Record<ButtonVariant, string> = {
  solid: "border border-transparent",
  outlined: "border",
  ghost: "border border-transparent bg-transparent",
};

const colorClasses: Record<ButtonColor, Record<ButtonVariant, string>> = {
  primary: {
    solid: "bg-primary text-primary-foreground hover:bg-primary/90",
    outlined: "border-primary text-primary hover:bg-primary/10",
    ghost: "text-primary hover:bg-primary/10",
  },
  secondary: {
    solid: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
    outlined: "border-secondary text-secondary hover:bg-secondary/10",
    ghost: "text-secondary hover:bg-secondary/10",
  },
  default: {
    solid: "bg-default text-default-foreground hover:bg-default/90",
    outlined: "border-border text-default-foreground hover:bg-default/90",
    ghost: "text-default-foreground hover:bg-default/90",
  },
  danger: {
    solid: "bg-danger text-danger-foreground hover:bg-danger/90",
    outlined: "border-danger text-danger hover:bg-danger/10",
    ghost: "text-danger hover:bg-danger/10",
  },
};

export function Button({
  children,
  size = "md",
  variant = "solid",
  color = "primary",
  className,
  ...buttonProps
}: ButtonProps) {
  return (
    <button
      {...buttonProps}
      className={`${baseClassName} ${sizeClasses[size]} ${variantClasses[variant]} ${colorClasses[color][variant]} ${className ?? ""}`.trim()}
    >
      {children}
    </button>
  );
}
