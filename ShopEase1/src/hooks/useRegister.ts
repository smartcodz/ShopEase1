import { useMutation } from "@tanstack/react-query";
import type { UseMutationResult } from "@tanstack/react-query";
import { register } from "../services/authService";
import type { AuthSession, RegisterInput } from "../types/auth";
import { useAuth } from "./useAuth";

// Creates the account, then logs the new user in straight away.
export function useRegister(): UseMutationResult<AuthSession, Error, RegisterInput> {
  const { signIn } = useAuth();

  return useMutation({
    mutationFn: (input: RegisterInput) => register(input),
    onSuccess: (session) => signIn(session),
  });
}
