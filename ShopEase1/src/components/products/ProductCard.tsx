import { useState } from "react";
import { Link } from "react-router";
import { ImageOff, Star } from "lucide-react";

import Badge from "../ui/Badge";
import AddToCartButton from "../cart/AddToCartButton";

import { formatPrice } from "../../lib/utils";
import type { Product } from "../../types/product";
import { usePrefetchProduct } from "../../hooks/usePrefetchProduct";

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  const prefetchProduct = usePrefetchProduct();
  const [imageFailed, setImageFailed] = useState<boolean>(false);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <Link
        to={`/products/${product.id}`}
        onMouseEnter={() => prefetchProduct(product.id)}
        onFocus={() => prefetchProduct(product.id)}
        className="group flex flex-1 flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-inset"
      >
        <div className="aspect-[4/3] overflow-hidden bg-slate-100">
          {imageFailed ? (
            <div
              role="img"
              aria-label={`Image of ${product.name} is unavailable`}
              className="flex h-full w-full items-center justify-center text-slate-400"
            >
              <ImageOff className="h-10 w-10" aria-hidden="true" />
            </div>
          ) : (
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              onError={() => setImageFailed(true)}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            />
          )}
        </div>

        <div className="flex flex-1 flex-col p-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="primary">{product.category}</Badge>

            {product.stock === 0 && (
              <Badge variant="danger">Out of stock</Badge>
            )}

            {product.stock > 0 && product.stock <= 10 && (
              <Badge variant="warning">Only {product.stock} left</Badge>
            )}
          </div>

          <h3 className="mt-3 line-clamp-1 font-semibold text-slate-900">
            {product.name}
          </h3>

          <p className="mt-1 line-clamp-2 text-sm text-slate-600">
            {product.description}
          </p>

          <div className="mt-auto flex items-center justify-between pt-4">
            <p className="text-lg font-bold text-slate-900">
              {formatPrice(product.price)}
            </p>

            <p className="inline-flex items-center gap-1 text-sm text-slate-600">
              <Star
                className="h-4 w-4 fill-amber-400 text-amber-400"
                aria-hidden="true"
              />

              <span className="sr-only">Rated </span>
              {product.rating.toFixed(1)}
              <span className="sr-only"> out of 5</span>
            </p>
          </div>
        </div>
      </Link>

      <div className="px-4 pb-4">
        <AddToCartButton product={product} className="w-full" />
      </div>
    </article>
  );
}

export default ProductCard;
