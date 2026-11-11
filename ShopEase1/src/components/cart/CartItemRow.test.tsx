import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useCart } from "../../hooks/useCart";
import { MAX_QUANTITY } from "../../lib/constants";
import { makeProduct, seedCart } from "../../test/factories";
import { renderApp } from "../../test/render";
import CartItemRow from "./CartItemRow";

const mug = makeProduct();

// The row gets its item as a prop, so this harness feeds it the LIVE item from the cart.
// That way a click changes the cart and the row re-renders, like on the real page.
function Harness({ productId }: { productId: number }) {
  const { items } = useCart();
  const item = items.find((entry) => entry.product.id === productId);

  return item ? (
    <ul>
      <CartItemRow item={item} />
    </ul>
  ) : (
    <p>Row removed</p>
  );
}

describe("CartItemRow", () => {
  it("shows the name as a link, the unit price, the quantity and the line total", () => {
    seedCart([[mug, 2]]);
    renderApp(<Harness productId={1} />);

    expect(screen.getByRole("link", { name: "Mug" })).toHaveAttribute(
      "href",
      "/products/1",
    );
    expect(screen.getByText("$19.99 each")).toBeInTheDocument();
    expect(screen.getByLabelText("Quantity")).toHaveTextContent("2");
    expect(screen.getByText("$39.98")).toBeInTheDocument();
  });

  it("increases the quantity and the line total", async () => {
    seedCart([[mug, 2]]);
    const { user } = renderApp(<Harness productId={1} />);

    await user.click(
      screen.getByRole("button", { name: "Increase quantity of Mug" }),
    );

    expect(screen.getByLabelText("Quantity")).toHaveTextContent("3");
    expect(screen.getByText("$59.97")).toBeInTheDocument();
  });

  it("decreases the quantity, but not below 1", async () => {
    seedCart([[mug, 2]]);
    const { user } = renderApp(<Harness productId={1} />);
    const decrease = screen.getByRole("button", {
      name: "Decrease quantity of Mug",
    });

    await user.click(decrease);

    expect(screen.getByLabelText("Quantity")).toHaveTextContent("1");
    expect(decrease).toBeDisabled();
  });

  it("disables 'increase' at the maximum quantity", () => {
    seedCart([[mug, MAX_QUANTITY]]);
    renderApp(<Harness productId={1} />);
    expect(
      screen.getByRole("button", { name: "Increase quantity of Mug" }),
    ).toBeDisabled();
  });

  it("removes the row", async () => {
    seedCart([[mug, 1]]);
    const { user } = renderApp(<Harness productId={1} />);

    await user.click(
      screen.getByRole("button", { name: "Remove Mug from cart" }),
    );

    expect(screen.getByText("Row removed")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Mug" })).not.toBeInTheDocument();
  });
});
