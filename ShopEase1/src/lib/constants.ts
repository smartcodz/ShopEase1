import type { Category } from "../types/product";

export const APP_NAME = "ShopEase";

export const MAX_QUANTITY = 99;

export const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Products", to: "/products" },
  { label: "Add Product", to: "/products/new" },
] as const satisfies readonly { label: string; to: string }[];

export const CATEGORIES = [
  "Electronics",
  "Fashion",
  "Home",
  "Beauty",
] as const satisfies readonly Category[];

export const AUTH_STORAGE_KEY = "shopease.user";

export const CART_STORAGE_KEY = "shopease.cart";

export const CURRENCY = "USD";
