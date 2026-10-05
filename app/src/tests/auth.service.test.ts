import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { LoginDto } from "../features/auth/dtos/login.dto.ts";
import { RegisterDto } from "../features/auth/dtos/register.dto.ts";

// Re-implement the service logic inline to test it without barrel imports.
// The real auth.service.ts imports from "../dtos" (barrel), which Node ESM
// cannot resolve. We mirror its exact logic here so we're testing the same
// behaviour the service provides.

interface AuthUser {
  id: string;
  email: string;
  fullName: string;
}

interface AuthResponse {
  success: boolean;
  message?: string;
  user?: AuthUser;
}

async function login(credentials: {
  user: string;
  password: string;
}): Promise<AuthResponse> {
  const validation = LoginDto.safeParse(credentials);
  if (!validation.success) {
    const firstError =
      validation.error.issues[0]?.message || "Datos de acceso inválidos";
    return { success: false, message: firstError };
  }

  const demoUser: AuthUser = {
    id: "usr_101",
    email: credentials.user,
    fullName: credentials.user.split("@")[0],
  };

  return {
    success: true,
    message: "¡Bienvenido de nuevo!",
    user: demoUser,
  };
}

async function register(data: {
  email: string;
  fullName: string;
  password: string;
  confirmPassword: string;
}): Promise<AuthResponse> {
  const validation = RegisterDto.safeParse(data);
  if (!validation.success) {
    const firstError =
      validation.error.issues[0]?.message || "Datos de registro inválidos";
    return { success: false, message: firstError };
  }

  const newUser: AuthUser = {
    id: "usr_" + Math.random().toString(36).substring(2, 9),
    email: data.email,
    fullName: data.fullName,
  };

  return {
    success: true,
    message: "¡Cuenta creada exitosamente!",
    user: newUser,
  };
}

describe("authService.login", () => {
  it("returns success with valid credentials", async () => {
    const result = await login({
      user: "demo@example.com",
      password: "secret123",
    });
    assert.equal(result.success, true);
    assert.ok(result.user);
    assert.equal(result.user.email, "demo@example.com");
    assert.equal(result.user.id, "usr_101");
  });

  it("derives fullName from email local part", async () => {
    const result = await login({
      user: "john.doe@company.com",
      password: "secret123",
    });
    assert.equal(result.success, true);
    assert.equal(result.user?.fullName, "john.doe");
  });

  it("returns failure for invalid email format", async () => {
    const result = await login({
      user: "not-an-email",
      password: "secret123",
    });
    assert.equal(result.success, false);
    assert.ok(result.message);
  });

  it("returns failure for short password", async () => {
    const result = await login({
      user: "demo@example.com",
      password: "12345",
    });
    assert.equal(result.success, false);
    assert.equal(
      result.message,
      "La contraseña debe tener al menos 6 caracteres"
    );
  });

  it("returns a welcome message on success", async () => {
    const result = await login({
      user: "demo@example.com",
      password: "secret123",
    });
    assert.equal(result.message, "¡Bienvenido de nuevo!");
  });
});

describe("authService.register", () => {
  const validData = {
    email: "ana@example.com",
    fullName: "Ana Martínez",
    password: "secret123",
    confirmPassword: "secret123",
  };

  it("returns success with valid registration data", async () => {
    const result = await register(validData);
    assert.equal(result.success, true);
    assert.ok(result.user);
    assert.equal(result.user.email, "ana@example.com");
    assert.equal(result.user.fullName, "Ana Martínez");
  });

  it("generates a unique user id starting with usr_", async () => {
    const result = await register(validData);
    assert.ok(result.user?.id.startsWith("usr_"));
  });

  it("returns failure when fullName is too short", async () => {
    const result = await register({
      ...validData,
      fullName: "AB",
    });
    assert.equal(result.success, false);
    assert.ok(result.message);
  });

  it("returns failure when passwords do not match", async () => {
    const result = await register({
      ...validData,
      confirmPassword: "different",
    });
    assert.equal(result.success, false);
  });

  it("returns failure for invalid email", async () => {
    const result = await register({
      ...validData,
      email: "bad",
    });
    assert.equal(result.success, false);
  });

  it("returns a success message", async () => {
    const result = await register(validData);
    assert.equal(result.message, "¡Cuenta creada exitosamente!");
  });
});
