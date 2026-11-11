import { screen } from "@testing-library/react";
import { Route, Routes } from "react-router";
import { describe, expect, it, vi } from "vitest";
import { makeProduct, seedCart } from "../test/factories";
import { renderApp } from "../test/render";
import CartPage from "./CartPage";

const mug = makeProduct();
const lamp = makeProduct({ id: 2, name: "Lamp", price: 45 });

function renderCartPage() {
  return renderApp(
    <Routes>
      <Route path="/cart" element={<CartPage />} />
      <Route path="/products" element={<p>Products page</p>} />
    </Routes>,
    { route: "/cart" },
  );
}

describe("CartPage", () => {
  it("shows the empty state and sends the shopper to the products", async () => {
    const { user } = renderCartPage();
    expect(screen.getByText("Your cart is empty")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Browse products" }));

    expect(screen.getByText("Products page")).toBeInTheDocument();
  });

  it("lists every item with the right subtotal", () => {
    seedCart([
      [mug, 2],
      [lamp, 1],
    ]);
    renderCartPage();

    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByText("Subtotal (3 items)")).toBeInTheDocument();
    expect(screen.getByText("$84.98")).toBeInTheDocument();
  });

  it("updates the subtotal when a quantity changes", async () => {
    seedCart([[mug, 2]]);
    const { user } = renderCartPage();

    await user.click(
      screen.getByRole("button", { name: "Increase quantity of Mug" }),
    );

    expect(screen.getByText("Subtotal (3 items)")).toBeInTheDocument();
    expect(screen.getAllByText("$59.97")).not.toHaveLength(0);
  });

  it("shows the empty state after the last item is removed", async () => {
    seedCart([[mug, 1]]);
    const { user } = renderCartPage();

    await user.click(
      screen.getByRole("button", { name: "Remove Mug from cart" }),
    );

    expect(screen.getByText("Your cart is empty")).toBeInTheDocument();
  });

  it("keeps the cart when 'Clear cart' is cancelled", async () => {
    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(false);
    seedCart([[mug, 1]]);
    const { user } = renderCartPage();

    await user.click(screen.getByRole("button", { name: "Clear cart" }));

    expect(confirmSpy).toHaveBeenCalledOnce();
    expect(screen.getByRole("link", { name: "Mug" })).toBeInTheDocument();
  });

  it("empties the cart when 'Clear cart' is confirmed", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);
    seedCart([[mug, 1]]);
    const { user } = renderCartPage();

    await user.click(screen.getByRole("button", { name: "Clear cart" }));

    expect(screen.getByText("Your cart is empty")).toBeInTheDocument();
  });
});
