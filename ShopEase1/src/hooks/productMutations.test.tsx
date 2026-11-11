import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { queryKeys } from "../lib/queryKeys";
import * as productService from "../services/productService";
import { makeProduct } from "../test/factories";
import { createTestQueryClient, createWrapper } from "../test/wrappers";
import { useCreateProduct } from "./useCreateProduct";
import { useDeleteProduct } from "./useDeleteProduct";
import { useProducts } from "./useProducts";
import { useUpdateProduct } from "./useUpdateProduct";

vi.mock("../services/productService", () => ({
  getProducts: vi.fn(),
  getProductById: vi.fn(),
  createProduct: vi.fn(),
  updateProduct: vi.fn(),
  deleteProduct: vi.fn(),
}));

const getProducts = vi.mocked(productService.getProducts);
const getProductById = vi.mocked(productService.getProductById);
const createProduct = vi.mocked(productService.createProduct);
const updateProduct = vi.mocked(productService.updateProduct);
const deleteProduct = vi.mocked(productService.deleteProduct);

const mug = makeProduct();
const lamp = makeProduct({ id: 2, name: "Lamp", price: 45 });

// Test input only needs the fields we care about, so we cast it once, here.
const lampInput = { name: "Lamp", price: 45 } as Parameters<
  typeof productService.createProduct
>[0];

beforeEach(() => {
  vi.resetAllMocks();
});

describe("useCreateProduct", () => {
  it("sends the input to the service", async () => {
    createProduct.mockResolvedValue(lamp);
    const { result } = renderHook(() => useCreateProduct(), {
      wrapper: createWrapper(),
    });

    act(() => result.current.mutate(lampInput));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(createProduct).toHaveBeenCalledWith(lampInput);
    expect(result.current.data).toEqual(lamp);
  });

  it("refetches an active product list after success", async () => {
    getProducts.mockResolvedValueOnce([mug]).mockResolvedValueOnce([mug, lamp]);
    createProduct.mockResolvedValue(lamp);
    const { result } = renderHook(
      () => ({ list: useProducts(), create: useCreateProduct() }),
      { wrapper: createWrapper() },
    );
    await waitFor(() => expect(result.current.list.data).toEqual([mug]));

    act(() => result.current.create.mutate(lampInput));

    await waitFor(() => expect(result.current.list.data).toEqual([mug, lamp]));
    expect(getProducts).toHaveBeenCalledTimes(2);
  });

  it("does NOT refetch the list when the create fails", async () => {
    getProducts.mockResolvedValue([mug]);
    createProduct.mockRejectedValue(new Error("Server error"));
    const { result } = renderHook(
      () => ({ list: useProducts(), create: useCreateProduct() }),
      { wrapper: createWrapper() },
    );
    await waitFor(() => expect(result.current.list.isSuccess).toBe(true));

    act(() => result.current.create.mutate(lampInput));

    await waitFor(() => expect(result.current.create.isError).toBe(true));
    expect(getProducts).toHaveBeenCalledTimes(1);
  });
});

describe("useUpdateProduct", () => {
  it("writes the saved product into the detail cache without refetching it", async () => {
    const updated = { ...mug, price: 25 };
    updateProduct.mockResolvedValue(updated);
    const queryClient = createTestQueryClient();
    queryClient.setQueryData(queryKeys.products.detail(1), mug);
    const { result } = renderHook(() => useUpdateProduct(), {
      wrapper: createWrapper(queryClient),
    });

    act(() => result.current.mutate({ id: 1, input: lampInput }));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(updateProduct).toHaveBeenCalledWith(1, lampInput);
    expect(queryClient.getQueryData(queryKeys.products.detail(1))).toEqual(
      updated,
    );
    expect(getProductById).not.toHaveBeenCalled();
  });

  it("refetches an active product list", async () => {
    getProducts
      .mockResolvedValueOnce([mug])
      .mockResolvedValueOnce([{ ...mug, price: 25 }]);
    updateProduct.mockResolvedValue({ ...mug, price: 25 });
    const { result } = renderHook(
      () => ({ list: useProducts(), update: useUpdateProduct() }),
      { wrapper: createWrapper() },
    );
    await waitFor(() => expect(result.current.list.data).toEqual([mug]));

    act(() => result.current.update.mutate({ id: 1, input: lampInput }));

    await waitFor(() => expect(result.current.list.data?.[0]?.price).toBe(25));
  });
});

describe("useDeleteProduct", () => {
  it("removes the product's detail entry from the cache", async () => {
    deleteProduct.mockResolvedValue(undefined);
    const queryClient = createTestQueryClient();
    queryClient.setQueryData(queryKeys.products.detail(1), mug);
    queryClient.setQueryData(queryKeys.products.detail(2), lamp);
    const { result } = renderHook(() => useDeleteProduct(), {
      wrapper: createWrapper(queryClient),
    });

    act(() => result.current.mutate(1));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(deleteProduct).toHaveBeenCalledWith(1);
    expect(
      queryClient.getQueryData(queryKeys.products.detail(1)),
    ).toBeUndefined();
    expect(queryClient.getQueryData(queryKeys.products.detail(2))).toEqual(
      lamp,
    ); // untouched
  });

  it("refetches an active product list", async () => {
    getProducts
      .mockResolvedValueOnce([mug, lamp])
      .mockResolvedValueOnce([lamp]);
    deleteProduct.mockResolvedValue(undefined);
    const { result } = renderHook(
      () => ({ list: useProducts(), remove: useDeleteProduct() }),
      { wrapper: createWrapper() },
    );
    await waitFor(() => expect(result.current.list.data).toEqual([mug, lamp]));

    act(() => result.current.remove.mutate(1));

    await waitFor(() => expect(result.current.list.data).toEqual([lamp]));
  });
});
