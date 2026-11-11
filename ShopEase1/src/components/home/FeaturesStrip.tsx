import { Headphones, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Feature {
  title: string;
  description: string;
  icon: LucideIcon;
}

const FEATURES: Feature[] = [
  {
    title: "Free shipping",
    description: "On every order over $50, delivered in 2 to 4 days.",
    icon: Truck,
  },
  {
    title: "Secure payment",
    description: "Your card details are encrypted and never stored.",
    icon: ShieldCheck,
  },
  {
    title: "Easy returns",
    description: "Changed your mind? Return within 30 days, no fuss.",
    icon: RotateCcw,
  },
  {
    title: "Friendly support",
    description: "Real people ready to help, seven days a week.",
    icon: Headphones,
  },
];

function FeaturesStrip() {
  return (
    <section aria-labelledby="features-heading">
      <h2 id="features-heading" className="sr-only">
        Why shop with ShopEase
      </h2>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {FEATURES.map(({ title, description, icon: Icon }) => (
          <li key={title}>
            <div className="h-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 font-semibold text-slate-900">{title}</h3>
              <p className="mt-1 text-sm text-slate-600">{description}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default FeaturesStrip;
