import { pbkdf2Sync } from "node:crypto";
import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "../lib/password";

const ALGORITHM = "pbkdf2-sha256";
const MIN_ITERATIONS = 600_000;

type EncodedHash = {
  algorithm: string;
  iterations: number;
  salt: string;
  digest: string;
};

const decode = (hash: string): EncodedHash => {
  const [algorithm, rawIterations, salt, digest] = hash.split("$");

  return {
    algorithm,
    iterations: Number(rawIterations),
    salt,
    digest,
  };
};

const hexToBytes = (hex: string) =>
  Uint8Array.from(hex.match(/.{2}/g) ?? [], (byte) => parseInt(byte, 16));

describe("hashPassword", () => {
  it("never leaks the plaintext password", async () => {
    const hash = await hashPassword("secret123");

    expect(hash).not.toContain("secret123");
  });

  it("produces a different hash every time for the same password", async () => {
    const first = await hashPassword("secret123");
    const second = await hashPassword("secret123");

    expect(first).not.toBe(second);
  });

  it("produces a different hash for a different password", async () => {
    const hash = await hashPassword("secret123");
    const other = await hashPassword("secret124");

    expect(hash).not.toBe(other);
  });

  it("derives the digest with the salt and the iteration count it encodes", async () => {
    const hash = await hashPassword("secret123");
    const { algorithm, iterations, salt, digest } = decode(hash);
    const expected = pbkdf2Sync(
      "secret123",
      hexToBytes(salt),
      iterations,
      32,
      "sha256"
    ).toString("hex");

    expect(algorithm).toBe(ALGORITHM);
    expect(digest).toBe(expected);
  });

  it("encodes a salt of 16 bytes as 32 hexadecimal characters", async () => {
    const { salt } = decode(await hashPassword("secret123"));

    expect(salt).toMatch(/^[0-9a-f]{32}$/);
  });

  it("encodes a digest of 32 bytes as 64 hexadecimal characters", async () => {
    const { digest } = decode(await hashPassword("secret123"));

    expect(digest).toMatch(/^[0-9a-f]{64}$/);
  });

  it("stretches the password with at least 600000 iterations", async () => {
    const { iterations } = decode(await hashPassword("secret123"));

    expect(iterations).toBeGreaterThanOrEqual(MIN_ITERATIONS);
  });

  it("hashes a password with non ascii characters", async () => {
    const password = "ñandú-Contraseña-🔐";
    const { algorithm, iterations, salt, digest } = decode(
      await hashPassword(password)
    );
    const expected = pbkdf2Sync(
      password,
      hexToBytes(salt),
      iterations,
      32,
      "sha256"
    ).toString("hex");

    expect(algorithm).toBe(ALGORITHM);
    expect(digest).toBe(expected);
  });
});

describe("verifyPassword", () => {
  it("accepts the password that produced the hash", async () => {
    const hash = await hashPassword("secret123");

    expect(await verifyPassword("secret123", hash)).toBe(true);
  });

  it("rejects a password that did not produce the hash", async () => {
    const hash = await hashPassword("secret123");

    expect(await verifyPassword("secret124", hash)).toBe(false);
  });

  it("rejects an empty password", async () => {
    const hash = await hashPassword("secret123");

    expect(await verifyPassword("", hash)).toBe(false);
  });

  it("rejects the hash of a different account", async () => {
    const ana = await hashPassword("secret123");
    const luis = await hashPassword("otra-clave");

    expect(await verifyPassword("otra-clave", ana)).toBe(false);
    expect(await verifyPassword("secret123", luis)).toBe(false);
  });

  it("accepts a password with non ascii characters", async () => {
    const password = "ñandú-Contraseña-🔐";
    const hash = await hashPassword(password);

    expect(await verifyPassword(password, hash)).toBe(true);
  });

  it("uses the salt encoded in the hash instead of a fresh one", async () => {
    const salt = "0f1e2d3c4b5a69788796a5b4c3d2e1f0";
    const digest = pbkdf2Sync("secret123", hexToBytes(salt), 1000, 32, "sha256").toString(
      "hex"
    );
    const hash = `${ALGORITHM}$1000$${salt}$${digest}`;

    expect(await verifyPassword("secret123", hash)).toBe(true);
  });

  it("uses the iteration count encoded in the hash instead of the current one", async () => {
    const salt = "0f1e2d3c4b5a69788796a5b4c3d2e1f0";
    const digest = pbkdf2Sync("secret123", hexToBytes(salt), 1000, 32, "sha256").toString(
      "hex"
    );
    const hash = `${ALGORITHM}$1000$${salt}$${digest}`;

    expect(await verifyPassword("secret124", hash)).toBe(false);
  });

  it.each([
    ["", "an empty string"],
    ["not-a-hash", "a value without separators"],
    ["pbkdf2-sha256$600000", "a value without the salt and the digest"],
    ["pbkdf2-sha256$600000$0f1e2d3c", "a value without the digest"],
    ["pbkdf2-sha256$muchos$0f1e2d3c4b5a69788796a5b4c3d2e1f0$00", "a non numeric iteration count"],
    ["pbkdf2-sha256$0$0f1e2d3c4b5a69788796a5b4c3d2e1f0$00", "an iteration count of zero"],
    ["bcrypt$12$0f1e2d3c4b5a69788796a5b4c3d2e1f0$00", "an unknown algorithm"],
    ["pbkdf2-sha256$600000$zz1e2d3c$0011", "a salt that is not hexadecimal"],
  ] as [string, string][])(
    "rejects the stored hash instead of throwing when it is %s",
    async (hash) => {
      expect(await verifyPassword("secret123", hash)).toBe(false);
    }
  );
});