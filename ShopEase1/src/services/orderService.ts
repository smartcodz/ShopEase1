import { api } from "./api";
import type { CreateOrderInput, Order } from "../types/order";

type ApiResponse<T> = { success: boolean; data: T };

export async function createOrder(order: CreateOrderInput): Promise<Order> {
  const { data } = await api.post<ApiResponse<Order>>("/orders", order);
  return data.data;
}

export async function getOrderById(id: string | number): Promise<Order> {
  const { data } = await api.get<ApiResponse<Order>>(`/orders/${id}`);
  return data.data;
}
