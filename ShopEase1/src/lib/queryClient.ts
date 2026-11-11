import { QueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";

// Retrying a 4xx (like 404) can never help, because the request itself is wrong.
// Network errors and 5xx errors might be temporary, so we try a couple more times.
function shouldRetry(failureCount: number, error: Error): boolean {
  if (
    isAxiosError(error) &&
    error.response !== undefined &&
    error.response.status >= 400 &&
    error.response.status < 500
  ) {
    return false;
  }
  return failureCount < 2;
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000, // a copy stays "fresh" for 30 seconds
      gcTime: 5 * 60_000, // unused copies are kept for 5 minutes
      retry: shouldRetry,
      retryDelay: (attempt: number) => Math.min(1000 * 2 ** attempt, 4000),
    },
  },
});
