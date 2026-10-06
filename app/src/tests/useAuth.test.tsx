import { act, render, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { useAuth } from "../hooks/useAuth";
import { USERS_KEY } from "@/lib/db/user";
import { hashPassword } from "@/lib/password";
import { SESSION_KEY, authSession } from "@/lib/session";
import { Response } from "@/types";
import { User } from "@/types/user";

const ana: User = {
  id: "usr_1",
  fullName: "Ana Martínez",
  email: "ana@example.com",
  createdAt: "2026-01-01T00:00:00.000Z",
};

const credentials = { email: ana.email, password: "secret123" };

const storeUser = async (password: string, user: User = ana) => {
  window.localStorage.setItem(
    USERS_KEY,
    JSON.stringify([{ ...user, passwordHash: await hashPassword(password) }])
  );
};

const openSession = (user: User = ana) => {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(user));
};

const renderAuth = () => renderHook(() => useAuth());

beforeEach(() => {
  window.localStorage.clear();
});

describe("useAuth user", () => {
  it("reports no user when there is no session", async () => {
    const { result } = renderAuth();

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it("reports the user of the stored session", async () => {
    openSession();

    const { result } = renderAuth();

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.user).toEqual(ana);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it("is loading until the session has been read", async () => {
    openSession();

    const loadingPerRender: boolean[] = [];

    function SessionProbe() {
      const { isLoading } = useAuth();

      loadingPerRender.push(isLoading);

      return null;
    }

    render(<SessionProbe />);

    expect(loadingPerRender[0]).toBe(true);
    expect(loadingPerRender.at(-1)).toBe(false);
  });

  it("reports no user when the stored session is corrupted", async () => {
    window.localStorage.setItem(SESSION_KEY, "{not-json");

    const { result } = renderAuth();

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.user).toBeNull();
  });

  it("never reports a password hash as part of the user", async () => {
    window.localStorage.setItem(
      SESSION_KEY,
      JSON.stringify({ ...ana, passwordHash: "pbkdf2-sha256$600000$00$11" })
    );

    const { result } = renderAuth();

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.user).toEqual(ana);
  });

  it("reports the user again after the session is written while mounted", async () => {
    const { result } = renderAuth();

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.user).toBeNull();

    act(() => authSession.save(ana));
    window.dispatchEvent(new StorageEvent("storage"));

    await waitFor(() => expect(result.current.user).toEqual(ana));
  });
});

describe("useAuth.login", () => {
  it("returns the user of the accepted credentials", async () => {
    await storeUser(credentials.password);

    const { result } = renderAuth();
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    let response!: Response<User>;
    await act(async () => {
      response = await result.current.login(credentials);
    });

    expect(response.success).toBe(true);
    expect(response.data?.email).toBe(ana.email);
    expect(result.current.user).toEqual(ana);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it("persists the session so a remount finds the user", async () => {
    await storeUser(credentials.password);

    const { result, unmount } = renderAuth();
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.login(credentials);
    });
    unmount();

    const { result: remounted } = renderAuth();
    await waitFor(() => expect(remounted.current.isLoading).toBe(false));

    expect(remounted.current.user?.email).toBe(ana.email);
  });

  it("rejects a wrong password and keeps the user logged out", async () => {
    await storeUser(credentials.password);

    const { result } = renderAuth();
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    let response!: Response<User>;
    await act(async () => {
      response = await result.current.login({ ...credentials, password: "otra-clave" });
    });

    expect(response.success).toBe(false);
    expect(result.current.user).toBeNull();
    expect(authSession.get()).toBeNull();
  });

  it("rejects an unknown email", async () => {
    await storeUser(credentials.password);

    const { result } = renderAuth();
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    let response!: Response<User>;
    await act(async () => {
      response = await result.current.login({ ...credentials, email: "otro@example.com" });
    });

    expect(response.success).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it("keeps the previous user when a new login is rejected", async () => {
    await storeUser(credentials.password);
    openSession();

    const { result } = renderAuth();
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.login({ ...credentials, password: "otra-clave" });
    });

    expect(result.current.user).toEqual(ana);
  });
});

describe("useAuth.logout", () => {
  it("drops the user and the stored session", async () => {
    openSession();

    const { result } = renderAuth();
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => result.current.logout());

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(authSession.get()).toBeNull();
  });

  it("leaves no user after logging out and remounting", async () => {
    openSession();

    const { result, unmount } = renderAuth();
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => result.current.logout());
    unmount();

    const { result: remounted } = renderAuth();
    await waitFor(() => expect(remounted.current.isLoading).toBe(false));

    expect(remounted.current.user).toBeNull();
  });

  it("logs out even when nobody is logged in", async () => {
    const { result } = renderAuth();
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => result.current.logout());

    expect(result.current.user).toBeNull();
  });

  it("keeps the registered users in localStorage", async () => {
    await storeUser(credentials.password);
    openSession();

    const { result } = renderAuth();
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => result.current.logout());

    expect(window.localStorage.getItem(USERS_KEY)).not.toBeNull();
  });

});

describe("useAuth reactivity", () => {
  it("gives every mounted hook the same session user", async () => {
    openSession();

    const first = renderAuth();
    const second = renderAuth();

    await waitFor(() => expect(first.result.current.isLoading).toBe(false));
    await waitFor(() => expect(second.result.current.isLoading).toBe(false));

    expect(first.result.current.user).toEqual(ana);
    expect(second.result.current.user).toEqual(ana);
  });

  it("reports no user after the session is cleared by another tab", async () => {
    openSession();

    const { result } = renderAuth();
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    window.localStorage.removeItem(SESSION_KEY);
    window.dispatchEvent(new StorageEvent("storage"));

    await waitFor(() => expect(result.current.user).toBeNull());
  });
});