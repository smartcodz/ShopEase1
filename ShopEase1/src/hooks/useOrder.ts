import { useQuery } from "@tanstack/react-query";
import type { UseQueryResult } from "@tanstack/react-query";
import { queryKeys } from "../lib/queryKeys";
import { getOrderById } from "../services/orderService";
import type { Order } from "../types/order";

export function useOrder(id: string | number): UseQueryResult<Order> {
  return useQuery({
    queryKey: queryKeys.orders.detail(id),
    queryFn: () => getOrderById(id),
    enabled:
      (typeof id === "number" && Number.isInteger(id) && id > 0) ||
      (typeof id === "string" && id.trim().length > 0),
  });
}
