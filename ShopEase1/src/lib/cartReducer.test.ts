import { describe, expect, it } from "vitest";
import {
  cartReducer,
  getCartCount,
  getCartTotal,
  getLineTotal,
  initialCartState,
} from "./cartReducer";
import { MAX_QUANTITY } from "./constants";
import type { CartState } from "../types/cart";
import type { Product } from "../types/product";
import { makeProduct } from "../test/factories";

const mug = makeProduct({ id: 1, price: 19.99 });
const lamp = makeProduct({ id: 2, price: 29.99 });

function stateWith(...entries: Array<[Product, number]>): CartState {
  return {
    items: entries.map(([product, quantity]) => ({ product, quantity })),
  };
}

describe("cartReducer: add", () => {
  it("adds a new product with quantity 1", () => {
    const state = cartReducer(initialCartState, { type: "add", product: mug });
    expect(state.items).toEqual([{ product: mug, quantity: 1 }]);
  });

  it("merges the same product into one line", () => {
    let state = cartReducer(initialCartState, { type: "add", product: mug });
    state = cartReducer(state, { type: "add", product: mug, quantity: 2 });
    expect(state.items).toHaveLength(1);
    expect(state.items[0]?.quantity).toBe(3);
  });

  it("keeps different products on separate lines", () => {
    let state = cartReducer(initialCartState, { type: "add", product: mug });
    state = cartReducer(state, { type: "add", product: lamp });
    expect(state.items.map((item) => item.product.id)).toEqual([1, 2]);
  });

  it("clamps the quantity to MAX_QUANTITY", () => {
    const state = cartReducer(initialCartState, {
      type: "add",
      product: mug,
      quantity: 500,
    });
    expect(state.items[0]?.quantity).toBe(MAX_QUANTITY);
  });

  it("clamps when merging beyond MAX_QUANTITY", () => {
    const start = stateWith([mug, MAX_QUANTITY - 1]);
    const state = cartReducer(start, {
      type: "add",
      product: mug,
      quantity: 5,
    });
    expect(state.items[0]?.quantity).toBe(MAX_QUANTITY);
  });

  it.each([0, -1, 1.5, Number.NaN])(
    "ignores the invalid quantity %s and returns the same state",
    (quantity) => {
      const start = stateWith([mug, 2]);
      expect(cartReducer(start, { type: "add", product: mug, quantity })).toBe(
        start,
      );
    },
  );
});

describe("cartReducer: remove, setQuantity, clear, hydrate", () => {
  it("removes a product", () => {
    const state = cartReducer(stateWith([mug, 1], [lamp, 1]), {
      type: "remove",
      productId: 1,
    });
    expect(state.items.map((item) => item.product.id)).toEqual([2]);
  });

  it("sets a new quantity", () => {
    const state = cartReducer(stateWith([mug, 1]), {
      type: "setQuantity",
      productId: 1,
      quantity: 4,
    });
    expect(state.items[0]?.quantity).toBe(4);
  });

  it("removes the line when the quantity is set to 0", () => {
    const state = cartReducer(stateWith([mug, 3]), {
      type: "setQuantity",
      productId: 1,
      quantity: 0,
    });
    expect(state.items).toEqual([]);
  });

  it("returns the same state for an unknown product id", () => {
    const start = stateWith([mug, 1]);
    expect(
      cartReducer(start, { type: "setQuantity", productId: 99, quantity: 2 }),
    ).toBe(start);
  });

  it("returns the same state for a non-integer quantity", () => {
    const start = stateWith([mug, 1]);
    expect(
      cartReducer(start, { type: "setQuantity", productId: 1, quantity: 2.5 }),
    ).toBe(start);
  });

  it("clears the cart", () => {
    expect(cartReducer(stateWith([mug, 3]), { type: "clear" })).toEqual(
      initialCartState,
    );
  });

  it("replaces the whole cart on hydrate", () => {
    const incoming = stateWith([lamp, 2]);
    expect(
      cartReducer(stateWith([mug, 1]), { type: "hydrate", state: incoming }),
    ).toBe(incoming);
  });
});

describe("cartReducer: purity", () => {
  it("never mutates the state it receives", () => {
    const start = stateWith([mug, 1]);
    const snapshot = structuredClone(start);

    cartReducer(start, { type: "add", product: mug });
    cartReducer(start, { type: "remove", productId: 1 });
    cartReducer(start, { type: "setQuantity", productId: 1, quantity: 9 });

    expect(start).toEqual(snapshot);
  });
});

describe("cart totals (money in cents)", () => {
  it("counts every unit", () => {
    expect(getCartCount(stateWith([mug, 3], [lamp, 2]))).toBe(5);
  });

  it("totals 19.99 x 3 as exactly 59.97", () => {
    expect(getCartTotal(stateWith([mug, 3]))).toBe(59.97);
  });

  it("totals 0.1 + 0.2 as exactly 0.3", () => {
    const dime = makeProduct({ id: 10, price: 0.1 });
    const twoDimes = makeProduct({ id: 11, price: 0.2 });
    expect(getCartTotal(stateWith([dime, 1], [twoDimes, 1]))).toBe(0.3);
  });

  it("totals an empty cart as 0", () => {
    expect(getCartTotal(initialCartState)).toBe(0);
  });

  it("computes one line total", () => {
    expect(getLineTotal({ product: mug, quantity: 3 })).toBe(59.97);
  });
});
