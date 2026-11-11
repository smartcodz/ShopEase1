import { CART_STORAGE_KEY, MAX_QUANTITY } from "./constants";
import { initialCartState } from "./cartReducer";
import type { CartItem, CartState } from "../types/cart";
import type { Product } from "../types/product";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

// We can only check the fields we rely on. Anything else on the product is trusted.
function isCartItem(value: unknown): value is CartItem {
  if (!isRecord(value) || !isRecord(value.product)) return false;

  const { product, quantity } = value;
  return (
    ((typeof product.id === "number" && Number.isFinite(product.id)) ||
      (typeof product.id === "string" && product.id.length > 0)) &&
    typeof product.name === "string" &&
    typeof product.price === "number" &&
    Number.isFinite(product.price) &&
    typeof quantity === "number" &&
    Number.isInteger(quantity) &&
    quantity >= 1 &&
    quantity <= MAX_QUANTITY
  );
}

export function readStoredCart(): CartState {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (raw === null) return initialCartState;

    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed) || !Array.isArray(parsed.items))
      return initialCartState;

    const items: CartItem[] = (parsed.items as unknown[]).filter(isCartItem);
    return { items };
  } catch {
    return initialCartState; // blocked storage or broken JSON
  }
}

export function writeStoredCart(state: CartState): void {
  try {
    const serialized = JSON.stringify(state);
    // Skipping identical writes avoids pointless storage events in other tabs.
    if (localStorage.getItem(CART_STORAGE_KEY) !== serialized) {
      localStorage.setItem(CART_STORAGE_KEY, serialized);
    }
  } catch {
    // Storage unavailable: the cart still works until the page is refreshed.
  }
}

// Keeps the `Product` import "used" for readers: items are trusted to match it.
export type StoredProduct = Product;
