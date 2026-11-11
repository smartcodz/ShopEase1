import { useEffect, useState } from "react";
import type { MouseEvent } from "react";
import { useCart } from "../../hooks/useCart";
import { MAX_QUANTITY } from "../../lib/constants";
import type { Product } from "../../types/product";

interface AddToCartButtonProps {
  product: Product;
  className?: string;
}

const CONFIRMATION_MS = 1500;

function AddToCartButton({ product, className = "" }: AddToCartButtonProps) {
  const { items, addItem } = useCart();
  const [justAdded, setJustAdded] = useState<boolean>(false);

  const inCart =
    items.find((item) => item.product.id === product.id)?.quantity ?? 0;
  const isMaxed = inCart >= MAX_QUANTITY;

  // Hide the "Added" message after a moment. The cleanup cancels the timer if the
  // component goes away first.
  useEffect(() => {
    if (!justAdded) return;
    const timerId = window.setTimeout(
      () => setJustAdded(false),
      CONFIRMATION_MS,
    );
    return () => window.clearTimeout(timerId);
  }, [justAdded]);

  const handleClick = (event: MouseEvent<HTMLButtonElement>): void => {
    event.preventDefault(); // never follow a surrounding link
    event.stopPropagation();
    addItem(product);
    setJustAdded(true);
  };

  const label = isMaxed
    ? "Max in cart"
    : justAdded
      ? "Added"
      : inCart > 0
        ? "Add another"
        : "Add to cart";

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={isMaxed}
        aria-label={`${label}: ${product.name}`}
        className={`inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:bg-slate-300 ${className}`}
      >
        {label}
      </button>
      <span role="status" className="sr-only">
        {justAdded ? "Added to cart" : ""}
      </span>
    </>
  );
}

export default AddToCartButton;
