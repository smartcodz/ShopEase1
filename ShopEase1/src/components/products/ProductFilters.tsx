import type { ChangeEvent } from "react";
import { Search } from "lucide-react";
import { CATEGORIES } from "../../lib/constants";
import type { CategoryFilter } from "../../types/product";

interface ProductFiltersProps {
  search: string;
  category: CategoryFilter;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: CategoryFilter) => void;
}

const CATEGORY_OPTIONS: CategoryFilter[] = ["All", ...CATEGORIES];

// A type guard: proves that a plain string is a valid CategoryFilter.
function isCategoryFilter(value: string): value is CategoryFilter {
  return CATEGORY_OPTIONS.some((option) => option === value);
}

const fieldClasses =
  "h-11 w-full rounded-lg border border-slate-300 bg-white text-slate-900 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30";

function ProductFilters({
  search,
  category,
  onSearchChange,
  onCategoryChange,
}: ProductFiltersProps) {
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>): void => {
    onSearchChange(event.target.value);
  };

  const handleCategoryChange = (
    event: ChangeEvent<HTMLSelectElement>,
  ): void => {
    const value = event.target.value;
    if (isCategoryFilter(value)) {
      onCategoryChange(value);
    }
  };

  return (
    <div
      role="search"
      className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row"
    >
      <div className="relative flex-1">
        <label htmlFor="product-search" className="sr-only">
          Search products
        </label>
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
          aria-hidden="true"
        />
        <input
          id="product-search"
          type="search"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search products by name..."
          className={`${fieldClasses} pl-10 pr-3 placeholder:text-slate-400`}
        />
      </div>

      <div className="sm:w-52">
        <label htmlFor="product-category" className="sr-only">
          Filter by category
        </label>
        <select
          id="product-category"
          value={category}
          onChange={handleCategoryChange}
          className={`${fieldClasses} px-3`}
        >
          {CATEGORY_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option === "All" ? "All categories" : option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default ProductFilters;
