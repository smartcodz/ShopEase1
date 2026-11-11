import { useCart } from "../../hooks/useCart";
import { formatPrice } from "../../lib/utils";

function CartSummary() {
  const { count, total, clearCart } = useCart();

  const handleClear = (): void => {
    if (window.confirm("Remove everything from your cart?")) {
      clearCart();
    }
  };

  return (
    <aside
      aria-live="polite"
      className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h2 className="text-lg font-semibold text-slate-900">Order summary</h2>

      <dl className="mt-4 flex items-baseline justify-between">
        <dt className="text-slate-600">
          Subtotal ({count} {count === 1 ? "item" : "items"})
        </dt>
        <dd className="text-xl font-bold tabular-nums text-slate-900">
          {formatPrice(total)}
        </dd>
      </dl>

      <p className="mt-2 text-sm text-slate-500">
        Shipping and taxes are calculated at checkout.
      </p>

      <a
        href="/checkout"
        className="mt-6 block rounded-lg bg-indigo-600 px-4 py-3 text-center font-semibold text-white hover:bg-indigo-700"
      >
        Checkout
      </a>

      <button
        type="button"
        onClick={handleClear}
        className="mt-4 text-sm font-medium text-red-600 hover:text-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
      >
        Clear cart
      </button>
    </aside>
  );
}

export default CartSummary;
