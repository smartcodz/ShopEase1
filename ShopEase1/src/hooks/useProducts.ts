import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { UseQueryResult } from "@tanstack/react-query";
import { queryKeys } from "../lib/queryKeys";
import {
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../services/productService";
import type { Product, CreateProductInput } from "../types/product";

interface UpdateProductVariables {
  id: string | number;
  input: CreateProductInput;
}

// Fetch products, optionally limiting the number returned.
export function useProducts(limit?: number) {
  return useQuery({
    queryKey: queryKeys.products.list(limit),
    queryFn: () => getProducts(limit === undefined ? {} : { limit }),
  });
}

// Fetch one product.
export function useProduct(id: string | number): UseQueryResult<Product> {
  return useQuery({
    queryKey: queryKeys.products.detail(id),
    queryFn: () => getProductById(id),
    enabled:
      (typeof id === "number" && Number.isInteger(id) && id > 0) ||
      (typeof id === "string" && id.trim().length > 0),
  });
}

// Delete a product.
export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) => deleteProduct(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.products.all,
      });
    },
  });
}

// Update a product.
export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: UpdateProductVariables) =>
      updateProduct(id, input),
    onSuccess: async (updatedProduct) => {
      queryClient.setQueryData(
        queryKeys.products.detail(updatedProduct.id),
        updatedProduct,
      );

      await queryClient.invalidateQueries({
        queryKey: queryKeys.products.all,
      });
    },
  });
}
