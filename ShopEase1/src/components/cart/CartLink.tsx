import { ShoppingCart } from "lucide-react";
import { useCart } from "../../hooks/useCart";

interface CartLinkProps {
  onClick?: () => void;
}

function describeCart(count: number): string {
  if (count === 0) return "Cart, empty";
  return `Cart, ${count} ${count === 1 ? "item" : "items"}`;
}

function CartLink({ onClick }: CartLinkProps) {
  const { count } = useCart();

  return (
    <a
      href="/cart"
      onClick={onClick}
      aria-label={describeCart(count)}
      className="relative inline-flex items-center rounded-lg p-2 text-slate-700 hover:bg-slate-100"
    >
      <ShoppingCart className="h-5 w-5" aria-hidden="true" />
      {count > 0 && (
        <span
          aria-hidden="true"
          className="absolute -right-1 -top-1 min-w-5 rounded-full bg-indigo-600 px-1 text-center text-xs font-bold leading-5 text-white"
        >
          {count > 99 ? "99+" : count}
        </span>
      )}
    </a>
  );
}

export default CartLink;
