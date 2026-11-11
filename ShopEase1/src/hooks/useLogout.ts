import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./useAuth";

// Forgets the user AND empties the cache, so the next person never sees old data.
export function useLogout(): () => void {
  const { signOut } = useAuth();
  const queryClient = useQueryClient();

  return useCallback((): void => {
    signOut();
    queryClient.clear();
  }, [signOut, queryClient]);
}
