import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { LoginDto } from "../features/auth/dtos/login.dto.ts";

describe("LoginDto", () => {
  it("accepts valid email and password", () => {
    const result = LoginDto.safeParse({
      user: "test@example.com",
      password: "secret123",
    });
    assert.equal(result.success, true);
  });

  it("rejects missing email", () => {
    const result = LoginDto.safeParse({
      user: "",
      password: "secret123",
    });
    assert.equal(result.success, false);
  });

  it("rejects invalid email format", () => {
    const result = LoginDto.safeParse({
      user: "not-an-email",
      password: "secret123",
    });
    assert.equal(result.success, false);
  });

  it("rejects password shorter than 6 characters", () => {
    const result = LoginDto.safeParse({
      user: "test@example.com",
      password: "12345",
    });
    assert.equal(result.success, false);
    if (!result.success) {
      const msg = result.error.issues[0]?.message;
      assert.equal(msg, "La contraseña debe tener al menos 6 caracteres");
    }
  });

  it("rejects missing password", () => {
    const result = LoginDto.safeParse({
      user: "test@example.com",
      password: "",
    });
    assert.equal(result.success, false);
  });

  it("accepts password with exactly 6 characters", () => {
    const result = LoginDto.safeParse({
      user: "test@example.com",
      password: "123456",
    });
    assert.equal(result.success, true);
  });

  it("rejects when both fields are missing", () => {
    const result = LoginDto.safeParse({});
    assert.equal(result.success, false);
  });
});
