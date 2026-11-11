import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

import {
  cartReducer,
  getCartCount,
  getCartTotal,
  initialCartState,
} from "./lib/cartReducer";
import type { Product } from "./types/product";

// TEMPORARY: delete after checking the console.
const demo = { id: 1, name: "Mug", price: 19.99 } as Product;
let cart = cartReducer(initialCartState, { type: "add", product: demo });
cart = cartReducer(cart, { type: "add", product: demo, quantity: 2 });
console.log(cart.items.length, getCartCount(cart), getCartTotal(cart)); // 1 3 59.97
cart = cartReducer(cart, { type: "setQuantity", productId: 1, quantity: 0 });
console.log(cart.items.length); // 0
