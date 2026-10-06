export type FormState<T> = {
  data: T;
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface Response<T> {
  data: T | null;
  success: boolean
  message: string
  errors?: Record<string, string[]>
}