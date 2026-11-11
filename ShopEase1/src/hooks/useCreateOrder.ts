import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UseMutationResult } from "@tanstack/react-query";
import { queryKeys } from "../lib/queryKeys";
import { createOrder } from "../services/orderService";
import type { CreateOrderInput, Order } from "../types/order";

// Saves the order and drops it straight into the cache for the confirmation page.
export function useCreateOrder(): UseMutationResult<
  Order,
  Error,
  CreateOrderInput
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (order: CreateOrderInput) => createOrder(order),
    onSuccess: (order) => {
      queryClient.setQueryData(queryKeys.orders.detail(order.id), order);
    },
  });
}
