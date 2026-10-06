import { beforeEach, describe, expect, it, vi } from "vitest";
import { authService } from "../features/auth/services/auth.service";
import { USERS_KEY } from "@/lib/db/user";
import { hashPassword } from "@/lib/password";
import { SESSION_KEY, authSession } from "@/lib/session";

const validData = {
  email: "ana@example.com",
  fullName: "Ana Martínez",
  password: "secret123",
  confirmPassword: "secret123",
};

const readUsers = () =>
  JSON.parse(window.localStorage.getItem(USERS_KEY) ?? "[]");

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
    window.localStorage.clear();
  });

  const login = (email: string, password: string) => authService.login({ email, password });

  const storeUser = async (password: string, email = validData.email) => {
    window.localStorage.setItem(
      USERS_KEY,
      JSON.stringify([
        {
          id: "usr_1",
          fullName: "Ana Martínez",
          email,
          createdAt: "2026-01-01T00:00:00.000Z",
          passwordHash: await hashPassword(password),
        },
      ])
    );
  };

  it("logs in when the password matches the stored hash", async () => {
    await storeUser(validData.password);

    const response = await login(validData.email, validData.password);

    expect(response.success).toBe(true);
    expect(response.data?.email).toBe("ana@example.com");
  });

  it("rejects a wrong password", async () => {
    await storeUser(validData.password);

    const response = await login(validData.email, "otra-clave");

    expect(response.success).toBe(false);
    expect(response.data).toBeNull();
  });


  it("rejects a user whose stored hash cannot be parsed", async () => {
    window.localStorage.setItem(
      USERS_KEY,
      JSON.stringify([
        {
          id: "usr_1",
          fullName: "Ana Martínez",
          email: validData.email,
          createdAt: "2026-01-01T00:00:00.000Z",
          passwordHash: "corrupto",
        },
      ])
    );

    const response = await login(validData.email, validData.password);

    expect(response.success).toBe(false);
    expect(response.data).toBeNull();
  });

  it("rejects a user stored before passwords were hashed", async () => {
    window.localStorage.setItem(
      USERS_KEY,
      JSON.stringify([
        {
          id: "usr_1",
          fullName: "Ana Martínez",
          email: validData.email,
          createdAt: "2026-01-01T00:00:00.000Z",
        },
      ])
    );

    const response = await login(validData.email, validData.password);

    expect(response.success).toBe(false);
    expect(response.data).toBeNull();
  });

  it("rejects an unknown email", async () => {
    await storeUser(validData.password);

    const response = await login("otro@example.com", validData.password);

    expect(response.success).toBe(false);
    expect(response.data).toBeNull();
  });

  it("never returns the stored hash to the caller", async () => {
    await storeUser(validData.password);

    const response = await login(validData.email, validData.password);

    expect(response.data).not.toHaveProperty("passwordHash");
  });

  it("logs in a user that register just stored", async () => {
    await authService.register(validData);

    const response = await login(validData.email, validData.password);

    expect(response.success).toBe(true);
    expect(response.data?.fullName).toBe("Ana Martínez");
  });

  it("rejects a wrong password for a user that register just stored", async () => {
    await authService.register(validData);

    const response = await login(validData.email, "otra-clave");

    expect(response.success).toBe(false);
  });

  it("opens a session for the user that logs in", async () => {
    await storeUser(validData.password);

    await login(validData.email, validData.password);

    expect(authSession.get()).toEqual({
      id: "usr_1",
      fullName: "Ana Martínez",
      email: validData.email,
      createdAt: "2026-01-01T00:00:00.000Z",
    });
  });

  it("stores the session without the password hash", async () => {
    await storeUser(validData.password);

    await login(validData.email, validData.password);

    expect(window.localStorage.getItem(SESSION_KEY) ?? "").not.toContain(
      "pbkdf2"
    );
  });

  it("leaves the previous session untouched when the credentials are rejected", async () => {
    await storeUser(validData.password);
    await login(validData.email, validData.password);

    await login(validData.email, "otra-clave");

    expect(authSession.get()?.email).toBe(validData.email);
  });

  it("leaves no session behind when the email is unknown", async () => {
    await storeUser(validData.password);

    await login("otro@example.com", validData.password);

    expect(authSession.get()).toBeNull();
  });

  it("replaces the session of the previous user", async () => {
    await storeUser(validData.password);
    await storeUser("clave-de-luis", "luis@example.com");

    await login(validData.email, validData.password);
    await login("luis@example.com", "clave-de-luis");

    expect(authSession.get()?.email).toBe("luis@example.com");
  });

  it("does not open a session when register only creates the account", async () => {
    await authService.register(validData);

    expect(authSession.get()).toBeNull();
  });
});

describe("authService.register", () => {
  it("returns success with the created user", async () => {
    const result = await register();

    expect(result.success).toBe(true);
    expect(result.message).toBe("¡Cuenta creada exitosamente!");
    expect(result.data?.email).toBe(validData.email);
    expect(result.data?.fullName).toBe(validData.fullName);
    expect(result.data?.id).toMatch(/^usr_[a-z0-9]+$/);
  });

  it("saves the user in localStorage", async () => {
    const result = await register();

    const stored = readUsers();

    expect(stored).toHaveLength(1);
    expect(stored[0]).toMatchObject({
      id: result.data?.id,
      email: validData.email,
      fullName: validData.fullName,
    });
    expect(typeof stored[0].createdAt).toBe("string");
  });

  it("never persists the password", async () => {
    await register();

    const raw = window.localStorage.getItem(USERS_KEY) ?? "";

    expect(raw).not.toContain(validData.password)
  });

  it("does not overwrite the stored user when the email already exists", async () => {
    const first = await register();

    await register();

    const stored = readUsers();

    expect(stored).toHaveLength(1);
    expect(stored[0].id).toBe(first.data?.id);
  });

  it("recovers from corrupted localStorage data", async () => {
    window.localStorage.setItem(USERS_KEY, "{not-json");

    const result = await register();

    expect(result.success).toBe(true);
    expect(readUsers()).toHaveLength(1);
  });

  it("ignores localStorage entries that are not an array", async () => {
    window.localStorage.setItem(USERS_KEY, JSON.stringify({}));

    const result = await register();

    expect(result.success).toBe(true);
    expect(readUsers()).toHaveLength(1);
  });
});
