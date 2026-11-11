import { useState } from "react";
import { SearchX } from "lucide-react";

import ProductFilters from "../components/products/ProductFilters";
import ProductGrid from "../components/products/ProductGrid";
import ProductSkeleton from "../components/products/ProductSkeleton";
import EmptyState from "../components/ui/EmptyState";
import ErrorMessage from "../components/ui/ErrorMessage";
import Spinner from "../components/ui/Spinner";

import { useDebounce } from "../hooks/useDebounce";
import { useProducts } from "../hooks/useProducts";
import { getErrorMessage } from "../services/api";

import type { CategoryFilter } from "../types/product";

const SKELETON_COUNT = 8;

function ProductsPage() {
  // Fetch products using the shared TanStack Query hook.
  const { data, isPending, isError, error, refetch } = useProducts();

  const products = data ?? [];

  // Search and category filter state.
  const [searchInput, setSearchInput] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("All");

  const debouncedSearch = useDebounce(searchInput, 300);

  const handleRetry = (): void => {
    void refetch();
  };

  const handleClearFilters = (): void => {
    setSearchInput("");
    setCategory("All");
  };

  // Filter products by name and category.
  const normalizedSearch = debouncedSearch.trim().toLowerCase();

  const filteredProducts = products.filter((product) => {
    const matchesCategory = category === "All" || product.category === category;

    const matchesSearch = product.name.toLowerCase().includes(normalizedSearch);

    return matchesCategory && matchesSearch;
  });

  const showFilters = products.length > 0;

  const renderContent = () => {
    if (isPending) {
      return (
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Spinner size="sm" label="Loading products" />
            <span aria-hidden="true">Loading products...</span>
          </div>

          <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: SKELETON_COUNT }, (_, index) => (
              <li key={index}>
                <ProductSkeleton />
              </li>
            ))}
          </ul>
        </div>
      );
    }

    // Show an error if products could not be loaded.
    if (isError && data === undefined) {
      return (
        <ErrorMessage
          title="We could not load the products"
          message={`${getErrorMessage(error)}. Check that the server is running, then try again.`}
          onRetry={handleRetry}
        />
      );
    }

    if (products.length === 0) {
      return (
        <EmptyState
          title="No products yet"
          description="There is nothing to show right now. Try refreshing the list."
          actionLabel="Refresh"
          onAction={handleRetry}
        />
      );
    }

    if (filteredProducts.length === 0) {
      return (
        <EmptyState
          icon={SearchX}
          title="No matching products"
          description="We could not find anything for those filters. Try a different word or category."
          actionLabel="Clear filters"
          onAction={handleClearFilters}
        />
      );
    }

    return <ProductGrid products={filteredProducts} />;
  };

  return (
    <section aria-busy={isPending}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Products
        </h1>

        {showFilters && (
          <p aria-live="polite" className="mt-1 text-slate-600">
            Showing {filteredProducts.length} of {products.length} products
          </p>
        )}
      </div>

      {showFilters && (
        <div className="mb-8">
          <ProductFilters
            search={searchInput}
            category={category}
            onSearchChange={setSearchInput}
            onCategoryChange={setCategory}
          />
        </div>
      )}

      {renderContent()}
    </section>
  );
}

export default ProductsPage;
