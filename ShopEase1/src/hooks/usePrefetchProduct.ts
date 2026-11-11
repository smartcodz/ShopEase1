import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../lib/queryKeys";
import { getProductById } from "../services/productService";

// Returns a function that quietly loads a product's details into the cache.
// Call it on hover or focus so the details page opens instantly.
export function usePrefetchProduct(): (id: string | number) => void {
  const queryClient = useQueryClient();

  return useCallback(
    (id: string | number): void => {
      void queryClient.prefetchQuery({
        queryKey: queryKeys.products.detail(id),
        queryFn: () => getProductById(id),
        staleTime: 30_000,
      });
    },
    [queryClient],
  );
}
