import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as productService from "../services/productService";
import { makeProduct } from "../test/factories";
import { createWrapper } from "../test/wrappers";
import { useProduct } from "./useProducts";

vi.mock("../services/productService", () => ({
  getProducts: vi.fn(),
  getProductById: vi.fn(),
  createProduct: vi.fn(),
  updateProduct: vi.fn(),
  deleteProduct: vi.fn(),
}));

const getProductById = vi.mocked(productService.getProductById);

beforeEach(() => {
  vi.resetAllMocks();
});

describe("useProduct", () => {
  it("fetches one product by id", async () => {
    const lamp = makeProduct({ id: 7, name: "Lamp", price: 45 });
    getProductById.mockResolvedValue(lamp);

    const { result } = renderHook(() => useProduct(7), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(lamp);
    expect(getProductById).toHaveBeenCalledWith(7);
  });

  it.each([0, -1, 1.5, Number.NaN])(
    "never calls the service for the invalid id %s",
    (id) => {
      const { result } = renderHook(() => useProduct(id), {
        wrapper: createWrapper(),
      });

      // "pending" = no data yet; "idle" = nothing is being fetched. A disabled query.
      expect(result.current.status).toBe("pending");
      expect(result.current.fetchStatus).toBe("idle");
      expect(getProductById).not.toHaveBeenCalled();
    },
  );

  it("turns a failure into an error state", async () => {
    getProductById.mockRejectedValue(new Error("Not found"));

    const { result } = renderHook(() => useProduct(999), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toBe("Not found");
  });
});
