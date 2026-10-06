import { act, render, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { getURLFromRedirectError } from "next/dist/client/components/redirect";
import {
  isRedirectError,
  type RedirectError,
} from "next/dist/client/components/redirect-error";
import { useAuth } from "../hooks/useAuth";
import { SESSION_KEY, authSession } from "@/lib/session";
import { User } from "@/types/user";

const ana: User = {
  id: "usr_1",
  fullName: "Ana Martínez",
  email: "ana@snail.dev",
  createdAt: "2026-01-01T00:00:00.000Z",
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
});

describe("useAuth.logout", () => {
  const logoutRedirecting = (logout: () => void): RedirectError => {
    let caught: unknown = null;

    try {
      act(() => logout());
    } catch (error) {
      act(() => {});
      caught = error;
    }

    expect(isRedirectError(caught)).toBe(true);

    return caught as RedirectError;
  };

  it("drops the user and the stored session, then redirects to /login", async () => {
    openSession();

    const { result } = renderAuth();
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const redirect = logoutRedirecting(() => result.current.logout());

    expect(getURLFromRedirectError(redirect)).toBe("/login");
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(authSession.get()).toBeNull();
    expect(window.localStorage.getItem(SESSION_KEY)).toBeNull();
  });
});
