import { act, fireEvent, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Link, useLocation } from "react-router";
import { useCart } from "../../hooks/useCart";
import { MAX_QUANTITY } from "../../lib/constants";
import { makeProduct, seedCart } from "../../test/factories";
import { renderApp } from "../../test/render";
import AddToCartButton from "./AddToCartButton";

const mug = makeProduct();

// Probes: tiny helpers that show state the button itself doesn't display.
function CartCount() {
  const { count } = useCart();
  return <p>Items in cart: {count}</p>;
}

function LocationProbe() {
  const { pathname } = useLocation();
  return <p>Location: {pathname}</p>;
}

afterEach(() => {
  vi.useRealTimers();
});

describe("AddToCartButton", () => {
  it("is a button named after the product", () => {
    renderApp(<AddToCartButton product={mug} />);
    expect(
      screen.getByRole("button", { name: "Add to cart: Mug" }),
    ).toBeEnabled();
  });

  it("adds one item when clicked", async () => {
    const { user } = renderApp(
      <>
        <AddToCartButton product={mug} />
        <CartCount />
      </>,
    );
    expect(screen.getByText("Items in cart: 0")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Add to cart: Mug" }));

    expect(screen.getByText("Items in cart: 1")).toBeInTheDocument();
  });

  it("confirms with 'Added', announces it, then goes back after 1.5 seconds", async () => {
    vi.useFakeTimers();
    renderApp(<AddToCartButton product={mug} />);

    fireEvent.click(screen.getByRole("button", { name: "Add to cart: Mug" }));

    expect(
      screen.getByRole("button", { name: "Added: Mug" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Added to cart");

    act(() => {
      vi.advanceTimersByTime(1500);
    });

    expect(
      screen.getByRole("button", { name: "Add another: Mug" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("status")).toBeEmptyDOMElement();
  });

  it("says 'Add another' when the product is already in the cart", () => {
    seedCart([[mug, 2]]);
    renderApp(<AddToCartButton product={mug} />);
    expect(
      screen.getByRole("button", { name: "Add another: Mug" }),
    ).toBeInTheDocument();
  });

  it("is disabled at the maximum quantity", () => {
    seedCart([[mug, MAX_QUANTITY]]);
    renderApp(<AddToCartButton product={mug} />);
    expect(
      screen.getByRole("button", { name: "Max in cart: Mug" }),
    ).toBeDisabled();
  });

  it("does not follow a surrounding link", async () => {
    const { user } = renderApp(
      <>
        <Link to="/products/1">
          <AddToCartButton product={mug} />
        </Link>
        <LocationProbe />
      </>,
      { route: "/products" },
    );

    await user.click(screen.getByRole("button", { name: "Add to cart: Mug" }));

    expect(screen.getByText("Location: /products")).toBeInTheDocument();
  });
});
