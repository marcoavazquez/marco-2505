import { describe, expect, it } from "vitest";
import { authSession, SESSION_KEY } from "../lib/session";
import { User } from "@/types/user";

const ana: User = {
  id: "usr_1",
  fullName: "Ana Martínez",
  email: "ana@example.com",
  createdAt: "2026-01-01T00:00:00.000Z",
};

const writeRaw = (raw: string) => window.localStorage.setItem(SESSION_KEY, raw);

describe("authSession.get", () => {
  it("returns null when no session has been stored", () => {
    expect(authSession.get()).toBeNull();
  });

  it("returns the stored user", () => {
    writeRaw(JSON.stringify(ana));

    expect(authSession.get()).toEqual(ana);
  });

  it("returns null when the stored session is not valid json", () => {
    writeRaw("{not-json");

    expect(authSession.get()).toBeNull();
  });

  it("returns null when the stored session is not an object", () => {
    writeRaw(JSON.stringify(["usr_1"]));

    expect(authSession.get()).toBeNull();
  });

  it("returns null when the stored session is an empty string", () => {
    writeRaw("");

    expect(authSession.get()).toBeNull();
  });
});

describe("authSession.save", () => {
  it("stores the user under the session localStorage key", () => {
    authSession.save(ana);

    expect(JSON.parse(window.localStorage.getItem(SESSION_KEY) ?? "null")).toEqual(ana);
  });

  it("makes the user readable through get", () => {
    authSession.save(ana);

    expect(authSession.get()).toEqual(ana);
  });

  it("replaces the session of the previous user", () => {
    const luis: User = { ...ana, id: "usr_2", email: "luis@example.com" };

    authSession.save(ana);
    authSession.save(luis);

    expect(authSession.get()).toEqual(luis);
  });
});

describe("authSession.clear", () => {
  it("removes the stored session", () => {
    authSession.save(ana);

    authSession.clear();

    expect(authSession.get()).toBeNull();
    expect(window.localStorage.getItem(SESSION_KEY)).toBeNull();
  });

  it("leaves nothing behind when no session was stored", () => {
    authSession.clear();

    expect(authSession.get()).toBeNull();
  });

  it("does not remove the stored users", () => {
    window.localStorage.setItem("snail.users", JSON.stringify([ana]));

    authSession.clear();

    expect(window.localStorage.getItem("snail.users")).not.toBeNull();
  });
});