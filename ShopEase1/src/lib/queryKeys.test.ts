import { QueryClient } from "@tanstack/react-query";
import { describe, expect, it } from "vitest";
import { queryKeys } from "./queryKeys";

describe("queryKeys", () => {
  it("invalidating `lists` hits every list but not details", async () => {
    const queryClient = new QueryClient();
    queryClient.setQueryData(queryKeys.products.list(4), []);
    queryClient.setQueryData(queryKeys.products.list(undefined), []);
    queryClient.setQueryData(queryKeys.products.detail(1), { id: 1 });

    await queryClient.invalidateQueries({
      queryKey: queryKeys.products.lists(),
    });

    expect(
      queryClient.getQueryState(queryKeys.products.list(4))?.isInvalidated,
    ).toBe(true);
    expect(
      queryClient.getQueryState(queryKeys.products.list(undefined))
        ?.isInvalidated,
    ).toBe(true);
    expect(
      queryClient.getQueryState(queryKeys.products.detail(1))?.isInvalidated,
    ).toBe(false);
  });

  it("invalidating `all` hits lists and details", async () => {
    const queryClient = new QueryClient();
    queryClient.setQueryData(queryKeys.products.list(4), []);
    queryClient.setQueryData(queryKeys.products.detail(1), { id: 1 });

    await queryClient.invalidateQueries({ queryKey: queryKeys.products.all });

    expect(
      queryClient.getQueryState(queryKeys.products.list(4))?.isInvalidated,
    ).toBe(true);
    expect(
      queryClient.getQueryState(queryKeys.products.detail(1))?.isInvalidated,
    ).toBe(true);
  });

  it("gives every product its own detail key", () => {
    expect(queryKeys.products.detail(1)).not.toEqual(
      queryKeys.products.detail(2),
    );
  });

  it("gives every limit its own list key", () => {
    expect(queryKeys.products.list(4)).not.toEqual(queryKeys.products.list(8));
  });
});
