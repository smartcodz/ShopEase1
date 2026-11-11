import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UseMutationResult } from "@tanstack/react-query";
import { queryKeys } from "../lib/queryKeys";
import { deleteProduct } from "../services/productService";

// Deletes a product, throws away its cached detail page, and refreshes the lists.
export function useDeleteProduct(): UseMutationResult<
  void,
  Error,
  string | number
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) => deleteProduct(id),
    onSuccess: (_data, id) => {
      queryClient.removeQueries({
        queryKey: queryKeys.products.detail(id),
        exact: true,
      });
      return queryClient.invalidateQueries({
        queryKey: queryKeys.products.lists(),
      });
    },
  });
}
