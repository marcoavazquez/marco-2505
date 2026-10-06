import type { ComponentProps, ReactNode } from "react";

export type AlertVariant = "danger" | "success";

export interface AlertProps
  extends Omit<ComponentProps<"div">, "children" | "role"> {
  children?: ReactNode;
  message?: string | null;
  variant?: AlertVariant;
}

const baseClassName = "rounded-md border px-3 py-2 text-sm";

const variantClasses: Record<AlertVariant, string> = {
  danger: "border-danger/40 bg-danger/10 text-danger",
  success: "border-success/40 bg-success/10 text-success",
};

const variantRoles: Record<AlertVariant, "alert" | "status"> = {
  danger: "alert",
  success: "status",
};

export function Alert({
  children,
  message,
  variant = "danger",
  className,
  ...divProps
}: AlertProps) {
  const content = children ?? message;

  if (!content) return null;

  return (
    <div
      {...divProps}
      role={variantRoles[variant]}
      className={`${baseClassName} ${variantClasses[variant]} ${className ?? ""}`.trim()}
    >
      {content}
    </div>
  );
}
