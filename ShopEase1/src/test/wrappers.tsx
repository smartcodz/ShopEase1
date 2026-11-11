import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import AuthProvider from "../app/AuthProvider";
import CartProvider from "../app/CartProvider";

// A brand-new client for every test, so tests can't leak cached data into each other.
export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: Infinity },
      mutations: { retry: false },
    },
  });
}

// The same provider stack the real app uses, in the same order.
export function createWrapper(
  queryClient: QueryClient = createTestQueryClient(),
) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <CartProvider>{children}</CartProvider>
        </AuthProvider>
      </QueryClientProvider>
    );
  };
}
