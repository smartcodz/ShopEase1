import type { Product } from "../types/product";
import { CART_STORAGE_KEY } from "../lib/constants";

// Starts a test with a filled cart, exactly as if the shopper had added things earlier.
export function seedCart(entries: Array<[Product, number]>): void {
  const items = entries.map(([product, quantity]) => ({ product, quantity }));
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ items }));
}

// Tests only need id, name and price. Add more fields here if your Product requires them.
export function makeProduct(overrides: Partial<Product> = {}): Product {
  return { id: 1, name: "Mug", price: 19.99, ...overrides } as Product;
}
