import { CheckCircle2, MapPin, Package } from "lucide-react";
import { Link, useParams } from "react-router";
import ErrorMessage from "../components/ui/ErrorMessage";
import Spinner from "../components/ui/Spinner";
import { useOrder } from "../hooks/useOrder";
import { formatPrice } from "../lib/utils";
import { getErrorMessage } from "../services/api";

function OrderConfirmationPage() {
  const { id } = useParams();
  const orderId = id && id.trim() !== "" ? id : "";
  const { data: order, isPending, isError, error, refetch } = useOrder(orderId);

  if (!orderId) {
    return (
      <ErrorMessage
        title="That order link is not valid"
        message="The order ID is missing from the address."
      />
    );
  }

  if (isPending) {
    return (
      <div className="flex items-center gap-2 text-slate-600">
        <Spinner size="sm" label="Loading order" />
        <span>Loading your order...</span>
      </div>
    );
  }

  if (isError || order === undefined) {
    return (
      <ErrorMessage
        title="We could not load this order"
        message={getErrorMessage(error)}
        onRetry={() => void refetch()}
      />
    );
  }

  const { shippingAddress } = order;

  return (
    <section className="mx-auto max-w-3xl">
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center sm:p-8">
        <CheckCircle2
          className="mx-auto h-12 w-12 text-emerald-600"
          aria-hidden="true"
        />
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
          Order confirmed
        </h1>
        <p className="mt-2 text-slate-600">
          Thanks for your order. We will prepare it for delivery shortly.
        </p>
        <p className="mt-3 text-sm font-medium text-slate-700">
          Order #{order.id}
        </p>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
            <Package className="h-5 w-5 text-indigo-600" aria-hidden="true" />
            Items
          </h2>
          <ul className="mt-4 divide-y divide-slate-200">
            {order.items.map((item) => (
              <li key={item.id} className="flex justify-between gap-4 py-3">
                <span className="text-slate-700">
                  {item.productName} × {item.quantity}
                </span>
                <span className="shrink-0 font-medium tabular-nums text-slate-900">
                  {formatPrice(item.subtotal)}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 flex justify-between border-t border-slate-200 pt-4 text-lg font-bold text-slate-900">
            <span>Total</span>
            <span className="tabular-nums">{formatPrice(order.totalAmount)}</span>
          </p>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
            <MapPin className="h-5 w-5 text-indigo-600" aria-hidden="true" />
            Delivery address
          </h2>
          <address className="mt-4 not-italic leading-7 text-slate-700">
            <p className="font-medium text-slate-900">{shippingAddress.fullName}</p>
            <p>{shippingAddress.addressLine1}</p>
            <p>{shippingAddress.city}</p>
            <p>{shippingAddress.country}</p>
            <p className="mt-3">{shippingAddress.phone}</p>
          </address>
          <p className="mt-6 text-sm text-slate-600">
            Status: <span className="font-medium">{order.status}</span>
          </p>
        </section>
      </div>

      <Link
        to="/products"
        className="mt-8 inline-flex rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        Continue shopping
      </Link>
    </section>
  );
}

export default OrderConfirmationPage;
