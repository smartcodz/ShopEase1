import { describe, expect, it } from "vitest";
import { formatPrice, getRedirectTarget } from "./utils";

describe("getRedirectTarget", () => {
  it("allows an in-app path", () => {
    expect(getRedirectTarget({ from: "/products/new" })).toBe("/products/new");
  });

  it("keeps a query string", () => {
    expect(getRedirectTarget({ from: "/products?page=2" })).toBe(
      "/products?page=2",
    );
  });

  it.each([
    ["a full URL", { from: "https://evil.example" }],
    ["a protocol-relative URL", { from: "//evil.example" }],
    ["a relative word", { from: "products" }],
    ["a number", { from: 5 }],
    ["an empty object", {}],
    ["null", null],
    ["undefined", undefined],
    ["a plain string", "/products"],
  ])("falls back to / for %s", (_label, state) => {
    expect(getRedirectTarget(state)).toBe("/");
  });
});

describe("formatPrice", () => {
  it("formats with a currency symbol, separators and two decimals", () => {
    expect(formatPrice(1234.5)).toBe("$1,234.50");
  });

  it("formats zero", () => {
    expect(formatPrice(0)).toBe("$0.00");
  });
});
