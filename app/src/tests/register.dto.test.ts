import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { RegisterDto } from "../features/auth/dtos/register.dto.ts";

describe("RegisterDto", () => {
  const validData = {
    email: "ana@example.com",
    fullName: "Ana Martínez",
    password: "secret123",
    confirmPassword: "secret123",
  };

  it("accepts valid registration data", () => {
    const result = RegisterDto.safeParse(validData);
    assert.equal(result.success, true);
  });

  it("rejects invalid email", () => {
    const result = RegisterDto.safeParse({
      ...validData,
      email: "not-an-email",
    });
    assert.equal(result.success, false);
  });

  it("rejects empty email", () => {
    const result = RegisterDto.safeParse({
      ...validData,
      email: "",
    });
    assert.equal(result.success, false);
  });

  it("rejects fullName shorter than 3 characters", () => {
    const result = RegisterDto.safeParse({
      ...validData,
      fullName: "AB",
    });
    assert.equal(result.success, false);
    if (!result.success) {
      const nameIssue = result.error.issues.find(
        (i) => i.path[0] === "fullName"
      );
      assert.ok(nameIssue);
      assert.equal(
        nameIssue.message,
        "El nombre debe tener al menos 3 caracteres"
      );
    }
  });

  it("accepts fullName with exactly 3 characters", () => {
    const result = RegisterDto.safeParse({
      ...validData,
      fullName: "Ana",
    });
    assert.equal(result.success, true);
  });

  it("rejects password shorter than 6 characters", () => {
    const result = RegisterDto.safeParse({
      ...validData,
      password: "12345",
      confirmPassword: "12345",
    });
    assert.equal(result.success, false);
  });

  it("rejects when passwords do not match", () => {
    const result = RegisterDto.safeParse({
      ...validData,
      password: "secret123",
      confirmPassword: "different",
    });
    assert.equal(result.success, false);
    if (!result.success) {
      const matchIssue = result.error.issues.find(
        (i) => i.path[0] === "confirmPassword"
      );
      assert.ok(matchIssue);
      assert.equal(matchIssue.message, "Las contraseñas no coinciden");
    }
  });

  it("rejects when confirmPassword is too short", () => {
    const result = RegisterDto.safeParse({
      ...validData,
      confirmPassword: "short",
    });
    assert.equal(result.success, false);
  });

  it("rejects when all fields are missing", () => {
    const result = RegisterDto.safeParse({});
    assert.equal(result.success, false);
  });
});
