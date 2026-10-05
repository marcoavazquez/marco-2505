"use client";

import { Input } from "./Input";
import type { InputProps } from "./Input";

export type TextInputProps = Omit<InputProps, "type">;

export function TextInput(props: TextInputProps) {
  return <Input type="text" {...props} />;
}
