import type { ComponentProps } from "react";
import { Alert, type AlertVariant } from "./Alert";

export type AlertsVariant = AlertVariant;

export interface AlertsProps
  extends Omit<ComponentProps<"div">, "children" | "role"> {
  messages?: string[];
  variant?: AlertsVariant;
}

export function Alerts({
  messages = [],
  variant = "danger",
  className,
  ...divProps
}: AlertsProps) {
  if (messages.length === 0) return null;

  return (
    <Alert
      {...divProps}
      variant={variant}
      className={`space-y-1 ${className ?? ""}`.trim()}
    >
      {messages.map((message) => (
        <p key={message}>{message}</p>
      ))}
    </Alert>
  );
}
