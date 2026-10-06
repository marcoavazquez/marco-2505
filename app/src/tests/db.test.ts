import { describe, expect, it } from "vitest";
import { userRepositoty } from "../lib/db/user";

const USERS_KEY = "snail.users";

const readRaw = () => window.localStorage.getItem(USERS_KEY);

const writeRaw = (raw: string) => window.localStorage.setItem(USERS_KEY, raw);

const ana = {
  id: "usr_1",
  fullName: "Ana Martínez",
  email: "ana@example.com",
  createdAt: "2026-01-01T00:00:00.000Z",
  passwordHash: "pbkdf2-sha256$600000$00$11",
};

const luis = {
  id: "usr_2",
  fullName: "Luis Soto",
  email: "luis@example.com",
  createdAt: "2026-02-02T00:00:00.000Z",
  passwordHash: "pbkdf2-sha256$600000$22$33",
};

describe("userRepositoty.getAll", () => {
  it("returns an empty list when nothing has been stored yet", () => {
    expect(userRepositoty.getAll()).toEqual([]);
  });

  it("returns every stored user with all of its fields", () => {
    writeRaw(JSON.stringify([ana, luis]));

    expect(userRepositoty.getAll()).toEqual([ana, luis]);
  });

  it("returns an empty list when the stored value is not valid json", () => {
    writeRaw("{not-json");

    expect(userRepositoty.getAll()).toEqual([]);
  });

  it("returns an empty list when the stored value is not an array", () => {
    writeRaw(JSON.stringify({ email: ana.email }));

    expect(userRepositoty.getAll()).toEqual([]);
  });
});

describe("userRepositoty.find", () => {
  it("returns the user that matches the email", () => {
    writeRaw(JSON.stringify([ana, luis]));

    expect(userRepositoty.find(ana.email)).toEqual(ana);
  });

  it("returns undefined when no user matches the email", () => {
    writeRaw(JSON.stringify([ana]));

    expect(userRepositoty.find("otro@example.com")).toBeUndefined();
  });

  it("returns undefined when nothing has been stored yet", () => {
    expect(userRepositoty.find(ana.email)).toBeUndefined();
  });

  it("matches the email exactly and ignores the case differences", () => {
    writeRaw(JSON.stringify([ana]));

    expect(userRepositoty.find("ANA@example.com")).toBeUndefined();
  });
});

describe("userRepositoty.save", () => {
  it("stores the user and reads it back from getAll", () => {
    userRepositoty.save(ana);

    expect(userRepositoty.getAll()).toEqual([ana]);
  });

  it("keeps the users that were stored before", () => {
    userRepositoty.save(ana);
    userRepositoty.save(luis);

    expect(userRepositoty.getAll()).toEqual([ana, luis]);
  });

  it("makes the saved user reachable through find", () => {
    userRepositoty.save(ana);

    expect(userRepositoty.find(ana.email)).toEqual(ana);
  });

  it("writes the users under the snail.users localStorage key", () => {
    userRepositoty.save(ana);

    expect(JSON.parse(readRaw() ?? "null")).toEqual([ana]);
  });

  it("overwrites the corrupted value instead of failing", () => {
    writeRaw("{not-json");

    userRepositoty.save(ana);

    expect(userRepositoty.getAll()).toEqual([ana]);
  });
});