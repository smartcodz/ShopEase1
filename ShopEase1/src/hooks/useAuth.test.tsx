import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AUTH_STORAGE_KEY } from "../lib/constants";
import { ACCESS_TOKEN_STORAGE_KEY } from "../services/api";
import { createTestQueryClient, createWrapper } from "../test/wrappers";
import type { AuthSession, User } from "../types/auth";
import { useAuth } from "./useAuth";

const ada: User = { id: 1, name: "Ada Obi", email: "ada@example.com" };
const adaSession: AuthSession = { user: ada, accessToken: "test-token" };

// Pretends another tab changed storage (the browser never fires this in the same tab).
function fireStorageEvent(key: string | null): void {
  window.dispatchEvent(new StorageEvent("storage", { key }));
}

describe("useAuth", () => {
  it("throws when used outside AuthProvider", () => {
    vi.spyOn(console, "error").mockImplementation(() => {}); // React logs the error too
    expect(() => renderHook(() => useAuth())).toThrow(
      "useAuth must be used inside AuthProvider",
    );
  });

  it("starts logged out", () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it("signIn sets the user and saves it", () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    act(() => result.current.signIn(adaSession));

    expect(result.current.user).toEqual(ada);
    expect(result.current.isAuthenticated).toBe(true);
    expect(
      JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY) ?? "null"),
    ).toEqual(ada);
    expect(localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)).toBe("test-token");
  });

  it("signOut clears the user and the saved copy", () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    act(() => result.current.signIn(adaSession));
    act(() => result.current.signOut());

    expect(result.current.user).toBeNull();
    expect(localStorage.getItem(AUTH_STORAGE_KEY)).toBeNull();
    expect(localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)).toBeNull();
  });

  it("restores a saved user on mount", () => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(ada));
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });
    expect(result.current.user).toEqual(ada);
  });

  it.each([
    ["a tampered value", '{"id":"x"}'],
    ["invalid JSON", "{not json"],
    ["a JSON string", '"hello"'],
    ["null", "null"],
  ])("treats %s in storage as logged out", (_label, stored) => {
    localStorage.setItem(AUTH_STORAGE_KEY, stored);
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });
    expect(result.current.user).toBeNull();
  });

  it("follows a logout from another tab and clears the query cache", () => {
    const queryClient = createTestQueryClient();
    queryClient.setQueryData(["secret"], 42);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(ada));

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(queryClient),
    });
    expect(result.current.user).toEqual(ada);

    act(() => {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      fireStorageEvent(AUTH_STORAGE_KEY);
    });

    expect(result.current.user).toBeNull();
    expect(queryClient.getQueryData(["secret"])).toBeUndefined();
  });

  it("follows a login from another tab", () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });
    expect(result.current.user).toBeNull();

    act(() => {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(ada));
      fireStorageEvent(AUTH_STORAGE_KEY);
    });

    expect(result.current.user).toEqual(ada);
  });

  it("follows localStorage.clear() (a null key)", () => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(ada));
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    act(() => {
      localStorage.clear();
      fireStorageEvent(null);
    });

    expect(result.current.user).toBeNull();
  });

  it("ignores storage events for unrelated keys", () => {
    const queryClient = createTestQueryClient();
    queryClient.setQueryData(["keep"], 1);
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(queryClient),
    });

    act(() => result.current.signIn(adaSession));
    act(() => fireStorageEvent("something-else"));

    expect(result.current.user).toEqual(ada);
    expect(queryClient.getQueryData(["keep"])).toBe(1);
  });
});
