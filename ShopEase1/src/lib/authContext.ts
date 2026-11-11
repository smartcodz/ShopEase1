import { createContext } from "react";
import type { User } from "../types/auth";
import type { AuthSession } from "../types/auth";

export interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  signIn: (session: AuthSession) => void;
  signOut: () => void;
}

// `undefined` means "no AuthProvider above this component".
export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);
