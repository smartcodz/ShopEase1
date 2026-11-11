import { NavLink } from "react-router";
import { NAV_LINKS } from "../../lib/constants";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <nav
      id="mobile-menu"
      aria-label="Mobile navigation"
      className="border-t border-slate-200 bg-white md:hidden"
    >
      <ul className="space-y-1 px-4 py-3 sm:px-6">
        {NAV_LINKS.map((link) => (
          <li key={link.to}>
            <NavLink
              to={link.to}
              end={link.to === "/"}
              onClick={onClose}
              className={({ isActive }) =>
                [
                  "block rounded-lg px-3 py-3 text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
                  isActive
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-slate-700 hover:bg-slate-50 hover:text-indigo-600",
                ].join(" ")
              }
            >
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default MobileMenu;
