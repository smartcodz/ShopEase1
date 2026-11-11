import type { Product } from "./product";

type ProductId = Product["id"];

export interface CartItem {
  product: Product; // a snapshot of the product at the time it was added
  quantity: number;
}

export interface CartState {
  items: CartItem[];
}

// Every way the cart can change. TypeScript narrows the fields by `type`.
export type CartAction =
  | { type: "add"; product: Product; quantity?: number }
  | { type: "remove"; productId: ProductId }
  | { type: "setQuantity"; productId: ProductId; quantity: number }
  | { type: "clear" }
  | { type: "hydrate"; state: CartState }; // replace the whole cart (used for tab sync)
