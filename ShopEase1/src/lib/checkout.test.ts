import { describe, expect, it } from "vitest";
import { buildNewOrder, validateShipping } from "./checkout";
import type { CartItem } from "../types/cart";
import type { Product } from "../types/product";
import type { ShippingDetails } from "../types/order";

function makeProduct(overrides: Partial<Product> = {}): Product {
  return { id: 1, name: "Mug", price: 19.99, ...overrides } as Product;
}

const validShipping: ShippingDetails = {
  fullName: "Ada Obi",
  addressLine1: "12 Marina Road",
  city: "Lagos",
  country: "Nigeria",
  phone: "+234 801-234-5678",
};

describe("validateShipping", () => {
  it("accepts valid details", () => {
    expect(validateShipping(validShipping)).toEqual({});
  });

  it("reports a too-short name, address, city and country", () => {
    const errors = validateShipping({
      ...validShipping,
      fullName: " A ",
      addressLine1: "12",
      city: "L",
      country: "N",
    });
    expect(Object.keys(errors).sort()).toEqual([
      "addressLine1",
      "city",
      "country",
      "fullName",
    ]);
  });

  it.each([
    "+234 801-234-5678",
    "08012345678",
    "555 1234",
    "+1 (555) 123".replace(/[()]/g, ""),
  ])("accepts the phone number %s", (phone) => {
    expect(validateShipping({ ...validShipping, phone }).phone).toBeUndefined();
  });

  it.each([
    "",
    "abc",
    "12345",
    "1234567890123456",
    "080-1234-abc",
    "12+345678",
  ])("rejects the phone number %j", (phone) => {
    expect(validateShipping({ ...validShipping, phone }).phone).toBeDefined();
  });
});

describe("buildNewOrder", () => {
  const items: CartItem[] = [
    { product: makeProduct(), quantity: 3 },
    { product: makeProduct({ id: 2, name: "Lamp", price: 45 }), quantity: 1 },
  ];

  it("sends only item IDs and quantities", () => {
    const order = buildNewOrder(items, validShipping);
    expect(order.items).toEqual([
      { productId: 1, quantity: 3 },
      { productId: 2, quantity: 1 },
    ]);
  });

  it("trims the shipping fields", () => {
    const order = buildNewOrder(items, {
      fullName: "  Ada Obi ",
      addressLine1: " 12 Marina Road  ",
      city: " Lagos ",
      country: " Nigeria ",
      phone: " 08012345678 ",
    });
    expect(order.shippingAddress).toEqual({
      fullName: "Ada Obi",
      addressLine1: "12 Marina Road",
      city: "Lagos",
      country: "Nigeria",
      phone: "08012345678",
    });
  });

  it("does not send client-controlled customer, price or status fields", () => {
    const order = buildNewOrder(items, validShipping);
    expect(order).not.toHaveProperty("userId");
    expect(order).not.toHaveProperty("total");
    expect(order).not.toHaveProperty("status");
  });
});
