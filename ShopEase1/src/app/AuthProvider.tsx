import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../lib/authContext";
import type { AuthContextValue } from "../lib/authContext";
import { AUTH_STORAGE_KEY } from "../lib/constants";
import { ACCESS_TOKEN_STORAGE_KEY } from "../services/api";
import type { AuthSession, User } from "../types/auth";

// Anyone can edit localStorage, so we check the shape instead of trusting it.
function isUser(value: unknown): value is User {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return (
    (typeof candidate.id === "string" || typeof candidate.id === "number") &&
    typeof candidate.name === "string" &&
    typeof candidate.email === "string"
  );
}

function readStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (raw === null) return null;
    const parsed: unknown = JSON.parse(raw);
    return isUser(parsed) ? parsed : null;
  } catch {
    return null; // blocked storage or broken JSON: treat as logged out
  }
}

interface AuthProviderProps {
  children: ReactNode;
}

function AuthProvider({ children }: AuthProviderProps) {
  const queryClient = useQueryClient();

  // Lazy initializer: runs once, on the first render only.
  const [user, setUser] = useState<User | null>(readStoredUser);

  // Follow login/logout done in OTHER tabs. (The browser does not fire this
  // event in the tab that made the change; that tab already updated itself.)
  useEffect(() => {
    const handleStorage = (event: StorageEvent): void => {
      if (event.key !== null && event.key !== AUTH_STORAGE_KEY) return;

      const nextUser = readStoredUser();
      setUser(nextUser);
      if (nextUser === null) {
        queryClient.clear();
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [queryClient]);

  const signIn = useCallback((session: AuthSession): void => {
    setUser(session.user);
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session.user));
      localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, session.accessToken);
    } catch {
      // Storage unavailable: the user stays signed in until the page is refreshed.
    }
  }, []);

  const signOut = useCallback((): void => {
    setUser(null);
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
    } catch {
      // Nothing to clean up if storage is unavailable.
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, isAuthenticated: user !== null, signIn, signOut }),
    [user, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
