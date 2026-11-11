import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { Menu, ShoppingBag, ShoppingCart, X, Trash2 } from "lucide-react";

import { APP_NAME, NAV_LINKS } from "../../lib/constants";
import MobileMenu from "./MobileMenu";
import { useAuth } from "../../hooks/useAuth";
import { useLogout } from "../../hooks/useLogout";
import { useCart } from "../../hooks/useCart";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const { user, isAuthenticated } = useAuth();
  const logout = useLogout();
  const navigate = useNavigate();

  const { addItem, count, total, clearCart } = useCart();

  const toggleMenu = (): void => setIsMenuOpen((previous) => !previous);

  const closeMenu = (): void => setIsMenuOpen(false);

  const handleLogout = (): void => {
    closeMenu();
    navigate("/");
    logout();
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          to="/"
          onClick={closeMenu}
          className="flex items-center gap-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
            <ShoppingBag className="h-5 w-5" aria-hidden="true" />
          </span>

          <span className="text-lg font-bold text-slate-900">{APP_NAME}</span>
        </Link>

        {/* Desktop navigation */}
        <nav aria-label="Main navigation" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === "/"}
                  className={({ isActive }) =>
                    [
                      "rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
                      isActive
                        ? "bg-indigo-50 text-indigo-600"
                        : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600",
                    ].join(" ")
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Shopping cart */}
          <Link
            to="/cart"
            aria-label={`Shopping cart, ${count} items`}
            className="relative rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <ShoppingCart className="h-5 w-5" aria-hidden="true" />

            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1 text-xs font-bold text-white">
                {count}
              </span>
            )}
          </Link>

          {/* Authentication actions */}
          <div className="hidden items-center gap-3 md:flex">
            {isAuthenticated && user ? (
              <>
                <span className="max-w-32 truncate text-sm text-slate-700">
                  Hi, {user.name}
                </span>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 md:hidden"
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Temporary cart testing controls */}
      <div className="flex flex-wrap items-center gap-3 border-t border-slate-100 px-4 py-2 text-sm">
        <span className="text-slate-600">
          Cart: {count} items · Total: ${total.toFixed(2)}
        </span>

        <button
          type="button"
          onClick={() =>
            addItem({
              id: 1,
              name: "Mug",
              price: 19.99,
              category: "Home",
              image: "https://placehold.co/300x300?text=Mug",
              description: "A ceramic mug for everyday use.",
              rating: 4.5,
              stock: 10,
            })
          }
          className="rounded-lg bg-indigo-600 px-3 py-1.5 font-medium text-white hover:bg-indigo-700"
        >
          + Add test mug
        </button>

        <button
          type="button"
          onClick={clearCart}
          className="flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-200"
        >
          <Trash2 size={15} />
          Clear cart
        </button>
      </div>

      <MobileMenu isOpen={isMenuOpen} onClose={closeMenu} />
    </header>
  );
}

export default Navbar;
