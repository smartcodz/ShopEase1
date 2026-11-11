import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { queryKeys } from "../lib/queryKeys";
import * as productService from "../services/productService";
import { makeProduct } from "../test/factories";
import { createTestQueryClient, createWrapper } from "../test/wrappers";
import { useProducts } from "./useProducts";

// The whole service file is replaced: no axios, no network.
vi.mock("../services/productService", () => ({
  getProducts: vi.fn(),
  getProductById: vi.fn(),
  createProduct: vi.fn(),
  updateProduct: vi.fn(),
  deleteProduct: vi.fn(),
}));

const getProducts = vi.mocked(productService.getProducts);

const mug = makeProduct();
const lamp = makeProduct({ id: 2, name: "Lamp", price: 45 });

beforeEach(() => {
  vi.resetAllMocks(); // forget calls and scripted answers from the previous test
});

describe("useProducts", () => {
  it("starts pending, then returns the products", async () => {
    getProducts.mockResolvedValue([mug, lamp]);

    const { result } = renderHook(() => useProducts(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isPending).toBe(true);
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([mug, lamp]);
  });

  it("loads products from the service", async () => {
    getProducts.mockResolvedValue([mug]);

    const { result } = renderHook(() => useProducts(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(getProducts).toHaveBeenCalledOnce();
  });

  it("exposes the error when the service fails", async () => {
    getProducts.mockRejectedValue(new Error("Network down"));

    const { result } = renderHook(() => useProducts(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toBe("Network down");
    expect(result.current.data).toBeUndefined();
  });

  it("gives a second hook the cached data on its very first render", async () => {
    getProducts.mockResolvedValue([mug, lamp]);
    const queryClient = createTestQueryClient();

    const first = renderHook(() => useProducts(), {
      wrapper: createWrapper(queryClient),
    });
    await waitFor(() => expect(first.result.current.isSuccess).toBe(true));

    const second = renderHook(() => useProducts(), {
      wrapper: createWrapper(queryClient),
    });

    // No spinner for the second visitor: the librarian already had a copy.
    expect(second.result.current.isPending).toBe(false);
    expect(second.result.current.data).toEqual([mug, lamp]);
  });

  it("stores products in the list cache", async () => {
    getProducts.mockResolvedValue([mug, lamp]);
    const queryClient = createTestQueryClient();

    const { result } = renderHook(() => useProducts(), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual([mug, lamp]);
    expect(queryClient.getQueryData(queryKeys.products.list())).toEqual([mug, lamp]);
  });
});
