import { Link } from "react-router";
import { Camera, MessageCircle, Send, ShoppingBag } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { APP_NAME } from "../../lib/constants";

interface FooterLink {
  label: string;
  to: string;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

interface SocialLink {
  label: string;
  href: string;
  icon: LucideIcon;
}

const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: "Shop",
    links: [
      { label: "All Products", to: "/products" },
      { label: "Add a Product", to: "/products/new" },
      { label: "Sign In", to: "/login" },
      { label: "Create Account", to: "/register" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", to: "/help" },
      { label: "Shipping", to: "/shipping" },
      { label: "Returns", to: "/returns" },
      { label: "Contact Us", to: "/contact" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", to: "/about" },
      { label: "Careers", to: "/careers" },
      { label: "Privacy Policy", to: "/privacy" },
      { label: "Terms of Service", to: "/terms" },
    ],
  },
];

const SOCIAL_LINKS: SocialLink[] = [
  { label: "Instagram", href: "https://instagram.com", icon: Camera },
  { label: "X (Twitter)", href: "https://x.com", icon: MessageCircle },
  { label: "Telegram", href: "https://telegram.org", icon: Send },
];

const linkClasses =
  "rounded text-sm text-slate-400 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400";

function Footer() {
  const year: number = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand block */}
          <div className="lg:col-span-2">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
                <ShoppingBag className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="text-lg font-bold text-white">{APP_NAME}</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-slate-400">
              Quality everyday products, delivered to your door.
            </p>

            <ul className="mt-6 flex items-center gap-3">
              {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-slate-300 transition-colors hover:bg-indigo-600 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Link columns */}
          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-white">
                {column.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className={linkClasses}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-slate-800 pt-6">
          <p className="text-center text-sm text-slate-500 sm:text-left">
            &copy; {year} {APP_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
