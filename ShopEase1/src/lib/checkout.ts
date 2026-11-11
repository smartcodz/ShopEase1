import type { CartItem } from "../types/cart";
import type { CreateOrderInput, ShippingDetails } from "../types/order";

export type ShippingErrors = Partial<Record<keyof ShippingDetails, string>>;

export function validateShipping(shipping: ShippingDetails): ShippingErrors {
  const errors: ShippingErrors = {};

  if (shipping.fullName.trim().length < 2) {
    errors.fullName = "Enter your full name.";
  }
  if (shipping.addressLine1.trim().length < 3) {
    errors.addressLine1 = "Enter your street address.";
  }
  if (shipping.city.trim().length < 2) {
    errors.city = "Enter your city.";
  }
  if (shipping.country.trim().length < 2) {
    errors.country = "Enter your country.";
  }

  const digits = shipping.phone.replace(/[\s-]/g, "").replace(/^\+/, "");
  if (!/^\d{7,15}$/.test(digits)) {
    errors.phone = "Enter a phone number with 7 to 15 digits.";
  }

  return errors;
}

// The server obtains the customer from the access token and recalculates prices.
export function buildNewOrder(
  items: CartItem[],
  shipping: ShippingDetails,
): CreateOrderInput {
  return {
    items: items.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
    })),
    shippingAddress: {
      fullName: shipping.fullName.trim(),
      addressLine1: shipping.addressLine1.trim(),
      city: shipping.city.trim(),
      country: shipping.country.trim(),
      phone: shipping.phone.trim(),
    },
  };
}
