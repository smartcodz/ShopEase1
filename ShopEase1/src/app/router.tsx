import { createBrowserRouter } from "react-router";
import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "../components/auth/ProtectedRoute";

import HomePage from "../pages/HomePage";
import CartPage from "../pages/CartPage";
import ProductsPage from "../pages/ProductsPage";
import ProductDetailsPage from "../pages/ProductDetailsPage";
import CreateProductPage from "../pages/CreateProductPage";
import EditProductPage from "../pages/EditProductPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import OrderConfirmationPage from "../pages/OrderConfirmationPage";
import CheckoutPage from "../pages/CheckoutPage";
import NotFoundPage from "../pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "checkout", element: <CheckoutPage /> },
      { path: "orders/:id", element: <OrderConfirmationPage /> },
      { path: "products", element: <ProductsPage /> },
      { path: "cart", element: <CartPage /> },
      { path: "products/:id", element: <ProductDetailsPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "*", element: <NotFoundPage /> },

      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "products/new",
            element: <CreateProductPage />,
          },
          {
            path: "products/:id/edit",
            element: <EditProductPage />,
          },
        ],
      },
    ],
  },
]);
