import { useCallback, useEffect, useMemo, useReducer } from "react";
import type { ReactNode } from "react";
import { CartContext } from "../lib/cartContext";
import type { CartContextValue } from "../lib/cartContext";
import {
  cartReducer,
  getCartCount,
  getCartTotal,
  initialCartState,
} from "../lib/cartReducer";
import { readStoredCart, writeStoredCart } from "../lib/cartStorage";
import { CART_STORAGE_KEY } from "../lib/constants";
import type { Product } from "../types/product";

interface CartProviderProps {
  children: ReactNode;
}

function CartProvider({ children }: CartProviderProps) {
  // Third argument is a lazy initializer: it reads storage once, on the first render.
  const [state, dispatch] = useReducer(
    cartReducer,
    initialCartState,
    readStoredCart,
  );

  // Save after every change.
  useEffect(() => {
    writeStoredCart(state);
  }, [state]);

  // Follow changes made by OTHER tabs.
  useEffect(() => {
    const handleStorage = (event: StorageEvent): void => {
      if (event.key !== null && event.key !== CART_STORAGE_KEY) return;
      dispatch({ type: "hydrate", state: readStoredCart() });
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const addItem = useCallback((product: Product, quantity?: number): void => {
    dispatch({ type: "add", product, quantity });
  }, []);

  const removeItem = useCallback((productId: Product["id"]): void => {
    dispatch({ type: "remove", productId });
  }, []);

  const setQuantity = useCallback(
    (productId: Product["id"], quantity: number): void => {
      dispatch({ type: "setQuantity", productId, quantity });
    },
    [],
  );

  const clearCart = useCallback((): void => {
    dispatch({ type: "clear" });
  }, []);

  const count = useMemo(() => getCartCount(state), [state]);
  const total = useMemo(() => getCartTotal(state), [state]);

  const value = useMemo<CartContextValue>(
    () => ({
      items: state.items,
      count,
      total,
      addItem,
      removeItem,
      setQuantity,
      clearCart,
    }),
    [state.items, count, total, addItem, removeItem, setQuantity, clearCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export default CartProvider;
