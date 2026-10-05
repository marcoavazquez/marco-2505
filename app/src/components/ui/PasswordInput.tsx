"use client";

import { Input } from "./Input";
import type { InputProps } from "./Input";

export type PasswordInputProps = Omit<InputProps, "type">;

export function PasswordInput(props: PasswordInputProps) {
  return <Input type="password" {...props} />;
}
