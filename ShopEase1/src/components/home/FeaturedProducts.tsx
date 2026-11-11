import { useEffect, useState } from "react";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import ProductCard from "../products/ProductCard";
import ProductSkeleton from "../products/ProductSkeleton";
import EmptyState from "../ui/EmptyState";
import ErrorMessage from "../ui/ErrorMessage";
import { getErrorMessage } from "../../services/api";
import { getProducts } from "../../services/productService";
import type { Product } from "../../types/product";

const FEATURED_COUNT = 4;
const gridClasses = "grid gap-6 sm:grid-cols-2 lg:grid-cols-4";

function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);

  // Same loading pattern as ProductsPage (still duplicated by hand).
  // TanStack Query will remove this repetition in Part 8.
  useEffect(() => {
    const loadProducts = async (): Promise<void> => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await getProducts({ limit: FEATURED_COUNT });

        // Safety net: even if the server ignores the limit, we only show 4.
        setProducts(data.slice(0, FEATURED_COUNT));
      } catch (err: unknown) {
        setError(getErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    };

    void loadProducts();
  }, [retryCount]);

  const handleRetry = (): void => setRetryCount((previous) => previous + 1);

  const renderContent = () => {
    if (isLoading) {
      return (
        <>
          <span role="status" className="sr-only">
            Loading featured products
          </span>
          <ul className={gridClasses}>
            {Array.from({ length: FEATURED_COUNT }, (_, index) => (
              <li key={index}>
                <ProductSkeleton />
              </li>
            ))}
          </ul>
        </>
      );
    }

    if (error) {
      return (
        <ErrorMessage
          title="We could not load featured products"
          message={`${error}. Check that the server is running, then try again.`}
          onRetry={handleRetry}
        />
      );
    }

    if (products.length === 0) {
      return (
        <EmptyState
          title="No featured products yet"
          description="Check back soon for hand-picked favorites."
          actionLabel="Refresh"
          onAction={handleRetry}
        />
      );
    }

    return (
      <ul className={gridClasses}>
        {products.map((product) => (
          <li key={product.id}>
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
    );
  };

  return (
    <section aria-labelledby="featured-heading" aria-busy={isLoading}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2
            id="featured-heading"
            className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
          >
            Featured products
          </h2>
          <p className="mt-1 text-slate-600">
            Hand-picked favorites from our store.
          </p>
        </div>
        <Link
          to="/products"
          className="inline-flex shrink-0 items-center gap-1 rounded text-sm font-semibold text-indigo-600 transition-colors hover:text-indigo-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
        >
          View all
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      <div className="mt-8">{renderContent()}</div>
    </section>
  );
}

export default FeaturedProducts;
