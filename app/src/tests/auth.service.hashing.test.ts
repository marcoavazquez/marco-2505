import { pbkdf2Sync } from "node:crypto";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { authService } from "../features/auth/services/auth.service";

const USERS_KEY = "snail.users";

const validData = {
  fullName: "Ana Martínez",
  email: "ana@example.com",
  password: "secret123",
  confirmPassword: "secret123",
};

const readRaw = () => window.localStorage.getItem(USERS_KEY) ?? "";

const readUsers = () => JSON.parse(readRaw() || "[]");

const register = async (data = validData) => {
  vi.useFakeTimers();
  const pending = authService.register(data);
  await vi.runAllTimersAsync();
  const response = await pending;
  vi.useRealTimers();
  return response;
};

const deriveDigest = (password: string, salt: string, iterations: number) =>
  pbkdf2Sync(
    password,
    Uint8Array.from(salt.match(/.{2}/g) ?? [], (byte) => parseInt(byte, 16)),
    iterations,
    32,
    "sha256"
  ).toString("hex");

describe("authService.register password hashing", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("stores a hash of the password instead of the password", async () => {
    await register();

    const [stored] = readUsers();
    const [, , salt, digest] = stored.passwordHash.split("$");

    expect(stored.passwordHash).toBe(
      `pbkdf2-sha256$600000$${salt}$${digest}`
    );
    expect(digest).toBe(deriveDigest(validData.password, salt, 600_000));
  });

  it("never writes the plaintext password to localStorage", async () => {
    await register();

    expect(readRaw()).not.toContain("secret123");
  });

  it("returns the created user without leaking the hash", async () => {
    const response = await register();

    expect(response.success).toBe(true);
    expect(response.data?.email).toBe("ana@example.com");
    expect(response.data).not.toHaveProperty("passwordHash");
  });


  it("keeps verifying the same password against the stored hash", async () => {
    await register();

    const [, , salt, digest] = readUsers()[0].passwordHash.split("$");

    expect(deriveDigest(validData.password, salt, 600_000)).toBe(digest);
    expect(deriveDigest("otra-clave", salt, 600_000)).not.toBe(digest);
  });
});