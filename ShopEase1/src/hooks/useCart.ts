import { useContext } from "react";
import { CartContext } from "../lib/cartContext";
import type { CartContextValue } from "../lib/cartContext";

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return context;
}
