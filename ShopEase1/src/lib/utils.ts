import { CATEGORIES } from "./constants";
import type {
  Category,
  CreateProductInput,
  ProductFormErrors,
  ProductFormValues,
} from "../types/product";

import { CURRENCY } from "./constants";

// Turns the text from the URL into a safe positive whole number, or null.
export function parseId(value: string | undefined): number | null {
  if (value === undefined || !/^\d+$/.test(value)) {
    return null;
  }

  const id = Number(value);

  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

// Shared look for inputs, selects, and textareas.
export function getFieldClasses(hasError: boolean): string {
  return [
    "block w-full rounded-lg border bg-white px-3.5 py-2.5 text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500",
    hasError
      ? "border-red-500 focus:border-red-500 focus:ring-red-500/30"
      : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/30",
  ].join(" ");
}

// A type guard: proves that a plain string is one of the four categories.
export function isCategory(value: string): value is Category {
  return CATEGORIES.some((category) => category === value);
}

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

// Checks every field and returns a message for each problem (an empty object means "all good").
export function validateProductForm(
  values: ProductFormValues,
): ProductFormErrors {
  const errors: ProductFormErrors = {};

  const name = values.name.trim();
  if (name === "") {
    errors.name = "Name is required.";
  } else if (name.length < 3) {
    errors.name = "Name must be at least 3 characters.";
  }

  const priceText = values.price.trim();
  const price = Number(priceText);
  if (priceText === "") {
    errors.price = "Price is required.";
  } else if (!Number.isFinite(price) || price <= 0) {
    errors.price = "Enter a price greater than 0.";
  }

  if (!isCategory(values.category)) {
    errors.category = "Please choose a category.";
  }

  const image = values.image.trim();
  if (image === "") {
    errors.image = "Image URL is required.";
  } else if (!isHttpUrl(image)) {
    errors.image = "Enter a full link that starts with http:// or https://";
  }

  const stockText = values.stock.trim();
  if (stockText === "") {
    errors.stock = "Stock is required.";
  } else if (!/^\d+$/.test(stockText)) {
    errors.stock = "Stock must be a whole number, 0 or more.";
  }

  const ratingText = values.rating.trim();
  const rating = Number(ratingText);
  if (ratingText === "") {
    errors.rating = "Rating is required.";
  } else if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    errors.rating = "Rating must be between 1 and 5.";
  }

  const description = values.description.trim();
  if (description === "") {
    errors.description = "Description is required.";
  } else if (description.length < 10) {
    errors.description = "Description must be at least 10 characters.";
  }

  return errors;
}

// Converts the form's text values into the typed object the API expects.
// Call this only AFTER validateProductForm found no errors.
export function toCreateProductInput(
  values: ProductFormValues,
): CreateProductInput {
  if (!isCategory(values.category)) {
    throw new Error("Invalid category.");
  }

  return {
    name: values.name.trim(),
    price: Number(values.price),
    category: values.category,
    image: values.image.trim(),
    description: values.description.trim(),
    rating: Number(values.rating),
    stock: Number(values.stock),
  };
}

// Only allow in-app paths like "/products/new". Never "https://..." or "//host".
export function getRedirectTarget(state: unknown): string {
  if (typeof state === "object" && state !== null && "from" in state) {
    const from = (state as { from: unknown }).from;
    if (
      typeof from === "string" &&
      from.startsWith("/") &&
      !from.startsWith("//")
    ) {
      return from;
    }
  }
  return "/";
}

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: CURRENCY,
});

export function formatPrice(amount: number): string {
  return priceFormatter.format(amount);
}
