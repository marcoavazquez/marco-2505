import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  AUTH_SESSION_STORAGE_KEY,
  AUTH_USERS_STORAGE_KEY,
  authService,
} from "../features/auth/services/auth.service";

const validData = {
  email: "ana@example.com",
  fullName: "Ana Martínez",
  password: "secret123",
  confirmPassword: "secret123",
};

const readUsers = () =>
  JSON.parse(window.localStorage.getItem(AUTH_USERS_STORAGE_KEY) ?? "[]");

const register = async (data = validData) => {
  vi.useFakeTimers();
  const pending = authService.register(data);
  await vi.runAllTimersAsync();
  const response = await pending;
  vi.useRealTimers();
  return response;
};

describe("authService.login", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  const login = async (credentials: { user: string; password: string }) => {
    const pending = authService.login(credentials);
    await vi.runAllTimersAsync();
    return pending;
  };

  it("returns success with valid credentials", async () => {
    const result = await login({
      user: "demo@example.com",
      password: "secret123",
    });

    expect(result.success).toBe(true);
    expect(result.user?.email).toBe("demo@example.com");
    expect(result.user?.id).toBe("usr_101");
  });

  it("derives fullName from email local part", async () => {
    const result = await login({
      user: "john.doe@company.com",
      password: "secret123",
    });

    expect(result.user?.fullName).toBe("john.doe");
  });

  it("returns a welcome message on success", async () => {
    const result = await login({
      user: "demo@example.com",
      password: "secret123",
    });

    expect(result.message).toBe("¡Bienvenido de nuevo!");
  });

  it("does not persist anything on login", async () => {
    await login({ user: "demo@example.com", password: "secret123" });

    expect(window.localStorage.getItem(AUTH_USERS_STORAGE_KEY)).toBeNull();
  });
});

describe("authService.register", () => {
  it("returns success with the created user", async () => {
    const result = await register();

    expect(result.success).toBe(true);
    expect(result.message).toBe("¡Cuenta creada exitosamente!");
    expect(result.user?.email).toBe("ana@example.com");
    expect(result.user?.fullName).toBe("Ana Martínez");
    expect(result.user?.id).toMatch(/^usr_[a-z0-9]+$/);
  });

  it("saves the user in localStorage", async () => {
    const result = await register();

    const stored = readUsers();

    expect(stored).toHaveLength(1);
    expect(stored[0]).toMatchObject({
      id: result.user?.id,
      email: "ana@example.com",
      fullName: "Ana Martínez",
    });
    expect(typeof stored[0].createdAt).toBe("string");
  });

  it("never persists the password", async () => {
    await register();

    const raw = window.localStorage.getItem(AUTH_USERS_STORAGE_KEY) ?? "";

    expect(raw).not.toContain("secret123");
    expect(raw).not.toContain("password");
  });

  it("saves the session in localStorage so the client stays logged in", async () => {
    const result = await register();

    const session = JSON.parse(
      window.localStorage.getItem(AUTH_SESSION_STORAGE_KEY) ?? "null"
    );

    expect(session).toEqual(result.user);
  });

  it("keeps previously registered users", async () => {
    await register();
    await register({
      ...validData,
      email: "luis@example.com",
      fullName: "Luis Soto",
    });

    const stored = readUsers();

    expect(stored).toHaveLength(2);
    expect(stored.map((user: { email: string }) => user.email)).toEqual([
      "ana@example.com",
      "luis@example.com",
    ]);
  });

  it("generates a different id per registration", async () => {
    const first = await register();
    const second = await register({ ...validData, email: "luis@example.com" });

    expect(first.user?.id).not.toBe(second.user?.id);
  });

  it("rejects an email that is already registered", async () => {
    await register();

    const result = await register();

    expect(result.success).toBe(false);
    expect(result.message).toBe(
      "Ya existe una cuenta registrada con ese correo"
    );
    expect(result.user).toBeUndefined();
  });

  it("does not overwrite the stored user when the email already exists", async () => {
    const first = await register();

    await register();

    const stored = readUsers();

    expect(stored).toHaveLength(1);
    expect(stored[0].id).toBe(first.user?.id);
  });

  it("recovers from corrupted localStorage data", async () => {
    window.localStorage.setItem(AUTH_USERS_STORAGE_KEY, "{not-json");

    const result = await register();

    expect(result.success).toBe(true);
    expect(readUsers()).toHaveLength(1);
  });

  it("ignores localStorage entries that are not an array", async () => {
    window.localStorage.setItem(AUTH_USERS_STORAGE_KEY, JSON.stringify({}));

    const result = await register();

    expect(result.success).toBe(true);
    expect(readUsers()).toHaveLength(1);
  });
});
