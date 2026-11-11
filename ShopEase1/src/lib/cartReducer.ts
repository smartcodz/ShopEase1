import { MAX_QUANTITY } from "./constants";
import type { CartAction, CartItem, CartState } from "../types/cart";

export const initialCartState: CartState = { items: [] };

function clamp(quantity: number): number {
  return Math.min(quantity, MAX_QUANTITY);
}

function isPositiveInteger(value: number): boolean {
  return Number.isInteger(value) && value > 0;
}

// The rulebook: current cart + request in, NEW cart out. Never changes the old one.
export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "add": {
      const quantity = action.quantity ?? 1;
      if (!isPositiveInteger(quantity)) return state;

      const exists = state.items.some(
        (item) => item.product.id === action.product.id,
      );

      if (exists) {
        return {
          items: state.items.map((item) =>
            item.product.id === action.product.id
              ? { ...item, quantity: clamp(item.quantity + quantity) }
              : item,
          ),
        };
      }

      return {
        items: [
          ...state.items,
          { product: action.product, quantity: clamp(quantity) },
        ],
      };
    }

    case "remove":
      return {
        items: state.items.filter(
          (item) => item.product.id !== action.productId,
        ),
      };

    case "setQuantity": {
      if (!Number.isInteger(action.quantity)) return state;

      if (!state.items.some((item) => item.product.id === action.productId))
        return state;

      if (action.quantity <= 0) {
        return {
          items: state.items.filter(
            (item) => item.product.id !== action.productId,
          ),
        };
      }

      return {
        items: state.items.map((item) =>
          item.product.id === action.productId
            ? { ...item, quantity: clamp(action.quantity) }
            : item,
        ),
      };
    }

    case "clear":
      return initialCartState;

    case "hydrate":
      return action.state;

    default: {
      // If you add a new action and forget to handle it, TypeScript fails here.
      const unreachable: never = action;
      return unreachable;
    }
  }
}

// Total number of units in the cart (3 shirts + 2 mugs = 5).
export function getCartCount(state: CartState): number {
  return state.items.reduce((sum, item) => sum + item.quantity, 0);
}

// Price x quantity for one row, calculated in whole cents.
export function getLineTotal(item: CartItem): number {
  return (Math.round(item.product.price * 100) * item.quantity) / 100;
}

// Totals are added up in whole cents to avoid 0.1 + 0.2 style rounding errors.
export function getCartTotal(state: CartState): number {
  const cents = state.items.reduce(
    (sum, item) => sum + Math.round(item.product.price * 100) * item.quantity,
    0,
  );

  return cents / 100;
}
