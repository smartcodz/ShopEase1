import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "../../hooks/useCart";
import { MAX_QUANTITY } from "../../lib/constants";
import { getLineTotal } from "../../lib/cartReducer";
import { formatPrice } from "../../lib/utils";
import type { CartItem } from "../../types/cart";

interface CartItemRowProps {
  item: CartItem;
}

const stepperButton =
  "inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-40";

function CartItemRow({ item }: CartItemRowProps) {
  const { setQuantity, removeItem } = useCart();
  const { product, quantity } = item;

  return (
    <li className="flex flex-wrap items-center justify-between gap-4 py-5">
      <div className="min-w-0 flex-1">
        <a
          href={`/products/${product.id}`}
          className="font-semibold text-slate-900 hover:text-indigo-600"
        >
          {product.name}
        </a>
        <p className="mt-1 text-sm text-slate-600">
          {formatPrice(product.price)} each
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          className={stepperButton}
          onClick={() => setQuantity(product.id, quantity - 1)}
          disabled={quantity <= 1}
          aria-label={`Decrease quantity of ${product.name}`}
        >
          <Minus className="h-4 w-4" aria-hidden="true" />
        </button>

        <span
          className="w-8 text-center font-medium tabular-nums"
          aria-label="Quantity"
        >
          {quantity}
        </span>

        <button
          type="button"
          className={stepperButton}
          onClick={() => setQuantity(product.id, quantity + 1)}
          disabled={quantity >= MAX_QUANTITY}
          aria-label={`Increase quantity of ${product.name}`}
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <p className="w-24 text-right font-semibold tabular-nums text-slate-900">
        {formatPrice(getLineTotal(item))}
      </p>

      <button
        type="button"
        className={stepperButton}
        onClick={() => removeItem(product.id)}
        aria-label={`Remove ${product.name} from cart`}
      >
        <Trash2 className="h-4 w-4" aria-hidden="true" />
      </button>
    </li>
  );
}

export default CartItemRow;
