import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";
import { useCreateOrder } from "../hooks/useCreateOrder";
import { getLineTotal } from "../lib/cartReducer";
import { buildNewOrder, validateShipping } from "../lib/checkout";
import type { ShippingErrors } from "../lib/checkout";
import { formatPrice } from "../lib/utils";
import { getErrorMessage } from "../services/api";
import type { ShippingDetails } from "../types/order";

interface FieldConfig {
  name: keyof ShippingDetails;
  label: string;
  autoComplete: string;
  type: "text" | "tel";
}

const FIELDS: FieldConfig[] = [
  { name: "fullName", label: "Full name", autoComplete: "name", type: "text" },
  {
    name: "addressLine1",
    label: "Street address",
    autoComplete: "street-address",
    type: "text",
  },
  { name: "city", label: "City", autoComplete: "address-level2", type: "text" },
  {
    name: "country",
    label: "Country",
    autoComplete: "country-name",
    type: "text",
  },
  { name: "phone", label: "Phone number", autoComplete: "tel", type: "tel" },
];

function CheckoutPage() {
  const { user } = useAuth();
  const { items, total, clearCart } = useCart();
  const { mutate, isPending, isError, error } = useCreateOrder();

  const [shipping, setShipping] = useState<ShippingDetails>({
    fullName: user?.name ?? "",
    addressLine1: "",
    city: "",
    country: "",
    phone: "",
  });
  const [errors, setErrors] = useState<ShippingErrors>({});
  const [placedOrderId, setPlacedOrderId] = useState<string | number | null>(
    null,
  );

  // Order matters: a placed order must win over "the cart is now empty".
  const redirectTo =
    placedOrderId !== null
      ? `/orders/${placedOrderId}`
      : user === null
        ? "/login"
        : items.length === 0
          ? "/cart"
          : null;

  useEffect(() => {
    if (redirectTo !== null) window.location.replace(redirectTo);
  }, [redirectTo]);

  if (redirectTo !== null) return null;

  const handleChange =
    (field: keyof ShippingDetails) =>
    (event: ChangeEvent<HTMLInputElement>): void => {
      const { value } = event.target;
      setShipping((previous) => ({ ...previous, [field]: value }));
    };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const nextErrors = validateShipping(shipping);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    if (user === null) return;

    mutate(buildNewOrder(items, shipping), {
      onSuccess: (order) => {
        setPlacedOrderId(order.id);
        clearCart();
      },
    });
  };

  return (
    <section>
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">
        Checkout
      </h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_22rem] lg:items-start">
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <h2 className="text-lg font-semibold text-slate-900">
            Shipping details
          </h2>

          {FIELDS.map((field) => {
            const errorId = `${field.name}-error`;
            const message = errors[field.name];
            return (
              <div key={field.name}>
                <label
                  htmlFor={field.name}
                  className="mb-1 block text-sm font-medium text-slate-700"
                >
                  {field.label}
                </label>
                <input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  autoComplete={field.autoComplete}
                  value={shipping[field.name]}
                  onChange={handleChange(field.name)}
                  aria-invalid={message !== undefined}
                  aria-describedby={message !== undefined ? errorId : undefined}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus-visible:outline-2 focus-visible:outline-indigo-600"
                />
                {message !== undefined && (
                  <p id={errorId} className="mt-1 text-sm text-red-600">
                    {message}
                  </p>
                )}
              </div>
            );
          })}

          <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
            Payment: <strong>pay on delivery</strong>. You won't be charged
            online.
          </p>

          {isError && (
            <p role="alert" className="text-sm text-red-600">
              {getErrorMessage(error)}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {isPending
              ? "Placing order..."
              : `Place order (${formatPrice(total)})`}
          </button>
        </form>

        <aside className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Your order</h2>
          <ul className="mt-4 divide-y divide-slate-200">
            {items.map((item) => (
              <li
                key={item.product.id}
                className="flex justify-between gap-3 py-3 text-sm"
              >
                <span className="text-slate-700">
                  {item.product.name} x {item.quantity}
                </span>
                <span className="tabular-nums font-medium text-slate-900">
                  {formatPrice(getLineTotal(item))}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 flex justify-between border-t border-slate-200 pt-4 font-bold text-slate-900">
            <span>Total</span>
            <span className="tabular-nums">{formatPrice(total)}</span>
          </p>
        </aside>
      </div>
    </section>
  );
}

export default CheckoutPage;
