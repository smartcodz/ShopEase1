import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UseMutationResult } from "@tanstack/react-query";
import { createProduct } from "../services/productService";
import type { Product } from "../types/product";

type ProductInput = Parameters<typeof createProduct>[0];

// Creates a product, then marks ALL product data as out of date so lists refresh.
export function useCreateProduct(): UseMutationResult<
  Product,
  Error,
  ProductInput
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ProductInput) => createProduct(input),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["products"] }),
  });
}
