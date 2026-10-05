import { describe, expect, it, vi } from "vitest";
import { registerAction } from "../features/auth/actions/register.action";
import {
  AUTH_USERS_STORAGE_KEY,
  authService,
} from "../features/auth/services/auth.service";
import { RegisterFormState } from "../features/auth/types";

const initialState: RegisterFormState = {
  data: {
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  },
  status: "idle",
  message: "",
  errors: {},
};

const validData = {
  fullName: "Ana Martínez",
  email: "ana@example.com",
  password: "secret123",
  confirmPassword: "secret123",
};

const buildFormData = (values: Record<string, string>) => {
  const formData = new FormData();

  for (const [key, value] of Object.entries(values)) {
    formData.append(key, value);
  }

  return formData;
};

const submit = (values: Record<string, string>) =>
  registerAction(initialState, buildFormData(values));

describe("registerAction", () => {
  it("returns a success state with the submitted data", async () => {
    vi.spyOn(authService, "register").mockResolvedValue({
      success: true,
      message: "¡Cuenta creada exitosamente!",
      user: { id: "usr_1", email: "ana@example.com", fullName: "Ana Martínez" },
    });

    const state = await submit(validData);

    expect(state.status).toBe("success");
    expect(state.message).toBe("¡Cuenta creada exitosamente!");
    expect(state.data).toEqual(validData);
    expect(state.errors).toBeUndefined();
  });

  it("registers the user through the auth service", async () => {
    const register = vi
      .spyOn(authService, "register")
      .mockResolvedValue({ success: true });

    await submit(validData);

    expect(register).toHaveBeenCalledWith(validData);
  });

  it("falls back to a default message when the service returns none", async () => {
    vi.spyOn(authService, "register").mockResolvedValue({ success: true });

    const state = await submit(validData);

    expect(state.message).toBe("¡Cuenta creada exitosamente!");
  });

  it("saves the account in localStorage through the real service", async () => {
    vi.useFakeTimers();
    const pending = registerAction(initialState, buildFormData(validData));
    await vi.runAllTimersAsync();
    const state = await pending;
    vi.useRealTimers();

    const stored = JSON.parse(
      window.localStorage.getItem(AUTH_USERS_STORAGE_KEY) ?? "[]"
    );

    expect(state.status).toBe("success");
    expect(stored).toHaveLength(1);
    expect(stored[0].email).toBe("ana@example.com");
  });

  it("returns an error state with field errors when the data is invalid", async () => {
    const state = await submit({});

    expect(state.status).toBe("error");
    expect(state.message).toBe("Error al registrarse");
    expect(Object.keys(state.errors ?? {}).sort()).toEqual([
      "confirmPassword",
      "email",
      "fullName",
      "password",
    ]);
  });

  it("does not call the service when the data is invalid", async () => {
    const register = vi.spyOn(authService, "register");

    await submit({ ...validData, email: "not-an-email" });

    expect(register).not.toHaveBeenCalled();
  });

  it("reports the confirmation error when the passwords do not match", async () => {
    const state = await submit({ ...validData, confirmPassword: "otra123" });

    expect(state.status).toBe("error");
    expect(state.errors?.confirmPassword).toEqual([
      "Las contraseñas no coinciden",
    ]);
  });

  it("reports the minimum length error for a short password", async () => {
    const state = await submit({ ...validData, password: "123", confirmPassword: "123" });

    expect(state.status).toBe("error");
    expect(state.errors?.password).toEqual([
      "La contraseña debe tener al menos 6 caracteres",
    ]);
  });

  it("returns a general error when the service rejects the registration", async () => {
    vi.spyOn(authService, "register").mockResolvedValue({
      success: false,
      message: "Ya existe una cuenta registrada con ese correo",
    });

    const state = await submit(validData);

    expect(state.status).toBe("error");
    expect(state.message).toBe("Ya existe una cuenta registrada con ese correo");
    expect(state.errors?.general).toEqual([
      "Ya existe una cuenta registrada con ese correo",
    ]);
  });

  it("uses a fallback message when the service fails without one", async () => {
    vi.spyOn(authService, "register").mockResolvedValue({ success: false });

    const state = await submit(validData);

    expect(state.status).toBe("error");
    expect(state.errors?.general).toEqual(["Error al registrarse"]);
  });

  it("returns a general error when the service throws", async () => {
    vi.spyOn(authService, "register").mockRejectedValue(new Error("boom"));

    const state = await submit(validData);

    expect(state.status).toBe("error");
    expect(state.message).toBe("Ocurrió un error al registrar la cuenta");
    expect(state.errors?.general).toEqual([
      "Ocurrió un error al registrar la cuenta",
    ]);
  });

  it("keeps the previous state data when the service fails", async () => {
    vi.spyOn(authService, "register").mockRejectedValue(new Error("boom"));

    const state = await registerAction(
      {
        ...initialState,
        data: {
          fullName: "Luis Soto",
          email: "luis@example.com",
          password: "secret123",
          confirmPassword: "secret123",
        },
      },
      buildFormData(validData)
    );

    expect(state.data.fullName).toBe("Luis Soto");
  });
});
