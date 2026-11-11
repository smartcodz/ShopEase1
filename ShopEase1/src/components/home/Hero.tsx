import { useState } from "react";
import { Link } from "react-router";
import { ArrowRight, ShoppingBag, Sparkles } from "lucide-react";

const HERO_IMAGE_URL = "https://picsum.photos/seed/shopease-hero/900/700";

function Hero() {
  const [imageFailed, setImageFailed] = useState<boolean>(false);

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden rounded-3xl bg-linear-to-br from-indigo-700 via-indigo-600 to-violet-600 shadow-lg"
    >
      {/* Decorative glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl"
      />

      <div className="relative grid items-center gap-10 px-6 py-12 sm:px-12 sm:py-16 lg:grid-cols-2 lg:gap-12 lg:px-16 lg:py-20">
        {/* Text column */}
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-medium text-white ring-1 ring-white/25">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            New season arrivals
          </span>

          <h1
            id="hero-heading"
            className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            Everything you love,{" "}
            <span className="text-indigo-200">delivered fast.</span>
          </h1>

          <p className="mt-5 max-w-xl text-lg text-indigo-100">
            Discover electronics, fashion, home goods, and beauty picks chosen
            for quality and value. Shop in a few taps and get it at your door.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 text-base font-semibold text-indigo-700 shadow-sm transition-colors hover:bg-indigo-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-700"
            >
              Shop now
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              to="/products/new"
              className="inline-flex items-center justify-center rounded-lg border border-white/40 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-700"
            >
              Add a product
            </Link>
          </div>
        </div>

        {/* Image column */}
        <div>
          {imageFailed ? (
            <div
              role="img"
              aria-label="Featured products image is unavailable"
              className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-3 rounded-2xl bg-white/10 text-white ring-1 ring-white/20"
            >
              <ShoppingBag className="h-12 w-12" aria-hidden="true" />
              <span className="text-sm font-medium">Image unavailable</span>
            </div>
          ) : (
            <img
              src={HERO_IMAGE_URL}
              alt="A bright selection of featured ShopEase products"
              width={900}
              height={700}
              onError={() => setImageFailed(true)}
              className="aspect-[4/3] w-full rounded-2xl object-cover shadow-2xl ring-1 ring-white/20"
            />
          )}
        </div>
      </div>
    </section>
  );
}

export default Hero;
