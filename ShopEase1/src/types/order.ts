import type { Product } from "./product";

export interface ShippingDetails {
  fullName: string;
  addressLine1: string;
  city: string;
  country: string;
  phone: string;
}

// This is the payload the customer sends. The API looks up current prices and
// attaches the signed-in customer itself, so neither belongs in this request.
export interface CreateOrderItem {
  productId: Product["id"];
  quantity: number;
}

export interface CreateOrderInput {
  items: CreateOrderItem[];
  shippingAddress: ShippingDetails;
}

export type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export interface OrderItem {
  id: string;
  productId: string | null;
  productName: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: string;
  customerId: string;
  status: OrderStatus;
  totalAmount: number;
  shippingAddress: ShippingDetails;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}
