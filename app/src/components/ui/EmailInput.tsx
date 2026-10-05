"use client";

import { Input } from "./Input";
import type { InputProps } from "./Input";

export type EmailInputProps = Omit<InputProps, "type">;

export function EmailInput(props: EmailInputProps) {
  return <Input type="email" {...props} />;
}
