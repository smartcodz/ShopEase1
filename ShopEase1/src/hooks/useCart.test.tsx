import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CART_STORAGE_KEY } from "../lib/constants";
import { makeProduct } from "../test/factories";
import { createWrapper } from "../test/wrappers";
import { useCart } from "./useCart";

const mug = makeProduct();
const lamp = makeProduct({ id: 2, name: "Lamp", price: 45 });

function fireStorageEvent(key: string | null): void {
  window.dispatchEvent(new StorageEvent("storage", { key }));
}

function readSavedCart(): unknown {
  return JSON.parse(localStorage.getItem(CART_STORAGE_KEY) ?? "null");
}

describe("useCart", () => {
  it("throws when used outside CartProvider", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => renderHook(() => useCart())).toThrow(
      "useCart must be used inside CartProvider",
    );
  });

  it("starts empty", () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: createWrapper(),
    });
    expect(result.current.items).toEqual([]);
    expect(result.current.count).toBe(0);
    expect(result.current.total).toBe(0);
  });

  it("addItem updates items, count and total", () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: createWrapper(),
    });

    act(() => result.current.addItem(mug, 3));
    act(() => result.current.addItem(lamp));

    expect(result.current.items).toHaveLength(2);
    expect(result.current.count).toBe(4);
    expect(result.current.total).toBe(104.97);
  });

  it("saves the cart to localStorage", () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: createWrapper(),
    });

    act(() => result.current.addItem(mug, 2));

    expect(readSavedCart()).toEqual({ items: [{ product: mug, quantity: 2 }] });
  });

  it("setQuantity and removeItem change the cart", () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: createWrapper(),
    });

    act(() => result.current.addItem(mug));
    act(() => result.current.addItem(lamp));
    act(() => result.current.setQuantity(1, 5));
    expect(
      result.current.items.find((item) => item.product.id === 1)?.quantity,
    ).toBe(5);

    act(() => result.current.removeItem(2));
    expect(result.current.items.map((item) => item.product.id)).toEqual([1]);
  });

  it("clearCart empties the cart and the saved copy", () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: createWrapper(),
    });

    act(() => result.current.addItem(mug));
    act(() => result.current.clearCart());

    expect(result.current.items).toEqual([]);
    expect(readSavedCart()).toEqual({ items: [] });
  });

  it("restores a saved cart on mount", () => {
    localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify({ items: [{ product: mug, quantity: 2 }] }),
    );
    const { result } = renderHook(() => useCart(), {
      wrapper: createWrapper(),
    });
    expect(result.current.count).toBe(2);
  });

  it("drops invalid saved items but keeps valid ones", () => {
    localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify({
        items: [
          { product: { id: 1, name: "Mug", price: 19.99 }, quantity: 2 },
          { product: { id: "x" }, quantity: 1 },
          { quantity: 0 },
          { product: { id: 3, name: "Hat", price: 10 }, quantity: 500 },
        ],
      }),
    );
    const { result } = renderHook(() => useCart(), {
      wrapper: createWrapper(),
    });

    expect(result.current.items).toEqual([
      { product: { id: 1, name: "Mug", price: 19.99 }, quantity: 2 },
    ]);
  });

  it.each([
    ["corrupt JSON", "{not json"],
    ["a wrong shape", '{"items":"nope"}'],
    ["null", "null"],
  ])("starts empty when storage holds %s", (_label, stored) => {
    localStorage.setItem(CART_STORAGE_KEY, stored);
    const { result } = renderHook(() => useCart(), {
      wrapper: createWrapper(),
    });
    expect(result.current.items).toEqual([]);
  });

  it("hydrates from another tab", () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: createWrapper(),
    });
    expect(result.current.count).toBe(0);

    act(() => {
      localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify({ items: [{ product: lamp, quantity: 2 }] }),
      );
      fireStorageEvent(CART_STORAGE_KEY);
    });

    expect(result.current.items).toEqual([{ product: lamp, quantity: 2 }]);
  });

  it("ignores storage events for unrelated keys", () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: createWrapper(),
    });
    act(() => result.current.addItem(mug));

    act(() => fireStorageEvent("something-else"));

    expect(result.current.count).toBe(1);
  });

  it("keeps the action functions stable between renders", () => {
    const { result, rerender } = renderHook(() => useCart(), {
      wrapper: createWrapper(),
    });
    const { addItem, removeItem, setQuantity, clearCart } = result.current;

    rerender();

    expect(result.current.addItem).toBe(addItem);
    expect(result.current.removeItem).toBe(removeItem);
    expect(result.current.setQuantity).toBe(setQuantity);
    expect(result.current.clearCart).toBe(clearCart);
  });
});
