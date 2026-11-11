import { createContext } from "react";
import type { CartItem } from "../types/cart";
import type { Product } from "../types/product";

export interface CartContextValue {
  items: CartItem[];
  count: number; // total units, for the Navbar badge
  total: number; // total price
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: Product["id"]) => void;
  setQuantity: (productId: Product["id"], quantity: number) => void;
  clearCart: () => void;
}

// `undefined` means "no CartProvider above this component".
export const CartContext = createContext<CartContextValue | undefined>(
  undefined,
);
