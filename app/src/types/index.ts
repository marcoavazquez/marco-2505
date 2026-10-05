export type Status = "success" | "error" | "idle";

export type FormState<T> = {
  data: T;
  status: Status;
  message: string;
  errors?: Record<string, string[]>;
}