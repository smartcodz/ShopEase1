import { Link } from "react-router";
import { ArrowLeft, Compass } from "lucide-react";

function NotFoundPage() {
  return (
    <section className="flex flex-col items-center py-16 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
        <Compass className="h-8 w-8" aria-hidden="true" />
      </span>
      <p className="mt-6 text-6xl font-extrabold text-indigo-600">404</p>
      <h1 className="mt-4 text-2xl font-bold text-slate-900 sm:text-3xl">
        We could not find that page
      </h1>
      <p className="mt-3 max-w-md text-slate-600">
        The address may be wrong, or the page may have moved. Let&apos;s get you
        back to the shop.
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to home
      </Link>
    </section>
  );
}

export default NotFoundPage;
