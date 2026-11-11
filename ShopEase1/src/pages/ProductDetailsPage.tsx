import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  ImageOff,
  Minus,
  Plus,
  SearchX,
  ShoppingCart,
  Star,
  Trash2,
  Pencil,
} from "lucide-react";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import ErrorMessage from "../components/ui/ErrorMessage";
import { formatPrice } from "../lib/utils";
import { getErrorMessage, isNotFoundError } from "../services/api";
import { deleteProduct, getProductById } from "../services/productService";
import type { Product } from "../types/product";

const quantityButtonClasses =
  "flex h-11 w-11 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50";

function DetailsSkeleton() {
  return (
    <>
      <span role="status" className="sr-only">
        Loading product
      </span>
      <div
        aria-hidden="true"
        className="grid animate-pulse gap-8 lg:grid-cols-2 lg:gap-12"
      >
        <div className="aspect-square rounded-2xl bg-slate-200" />
        <div className="space-y-4">
          <div className="h-6 w-24 rounded-full bg-slate-200" />
          <div className="h-9 w-3/4 rounded bg-slate-200" />
          <div className="h-5 w-40 rounded bg-slate-200" />
          <div className="h-9 w-32 rounded bg-slate-200" />
          <div className="h-4 w-full rounded bg-slate-200" />
          <div className="h-4 w-full rounded bg-slate-200" />
          <div className="h-4 w-2/3 rounded bg-slate-200" />
          <div className="h-12 w-full rounded-lg bg-slate-200" />
        </div>
      </div>
    </>
  );
}

function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const productId = id && id.trim() !== "" ? id : null;

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isNotFound, setIsNotFound] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [addedMessage, setAddedMessage] = useState<string | null>(null);
  const [imageFailed, setImageFailed] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    if (productId === null) {
      return;
    }

    const loadProduct = async (): Promise<void> => {
      try {
        setIsLoading(true);
        setIsNotFound(false);
        setError(null);
        setProduct(null);
        setQuantity(1);
        setAddedMessage(null);
        setImageFailed(false);

        const data = await getProductById(productId);
        setProduct(data);
      } catch (err: unknown) {
        if (isNotFoundError(err)) {
          setIsNotFound(true);
        } else {
          setError(getErrorMessage(err));
        }
      } finally {
        setIsLoading(false);
      }
    };

    void loadProduct();
  }, [productId, retryCount]);

  const handleRetry = (): void => {
    setRetryCount((previous) => previous + 1);
  };

  const handleDecrease = (): void => {
    setQuantity((previous) => Math.max(1, previous - 1));
    setAddedMessage(null);
  };

  const handleIncrease = (maxQuantity: number): void => {
    setQuantity((previous) => Math.min(maxQuantity, previous + 1));
    setAddedMessage(null);
  };

  const handleAddToCart = (item: Product): void => {
    setAddedMessage(`Added ${quantity} x ${item.name} to your cart (demo).`);
  };

  const handleDelete = async (): Promise<void> => {
    if (!product || productId === null || isDeleting) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?`,
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
    setDeleteError(null);

    try {
      await deleteProduct(productId);
      navigate("/products");
    } catch (err: unknown) {
      setDeleteError(getErrorMessage(err));
    } finally {
      setIsDeleting(false);
    }
  };

  const renderNotFound = (title: string, description: string) => (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-500">
        <SearchX className="h-7 w-7" aria-hidden="true" />
      </span>
      <h1 className="mt-5 text-2xl font-bold text-slate-900">{title}</h1>
      <p className="mt-2 max-w-md text-slate-600">{description}</p>
      <Link
        to="/products"
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to products
      </Link>
    </div>
  );

  const renderStockBadge = (stock: number) => {
    if (stock === 0) {
      return <Badge variant="danger">Out of stock</Badge>;
    }

    if (stock <= 10) {
      return <Badge variant="warning">Only {stock} left</Badge>;
    }

    return <Badge variant="success">In stock</Badge>;
  };

  const renderProduct = (item: Product) => {
    const isOutOfStock = item.stock === 0;

    return (
      <article className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="aspect-square overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm">
          {imageFailed ? (
            <div
              role="img"
              aria-label={`Image of ${item.name} is unavailable`}
              className="flex h-full w-full items-center justify-center text-slate-400"
            >
              <ImageOff className="h-16 w-16" aria-hidden="true" />
            </div>
          ) : (
            <img
              src={item.image}
              alt={item.name}
              onError={() => setImageFailed(true)}
              className="h-full w-full object-cover"
            />
          )}
        </div>

        <div className="flex flex-col">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="primary">{item.category}</Badge>
            {renderStockBadge(item.stock)}
          </div>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {item.name}
          </h1>

          <div className="mt-3 flex items-center gap-2">
            <div className="flex" aria-hidden="true">
              {Array.from({ length: 5 }, (_, index) => (
                <Star
                  key={index}
                  className={[
                    "h-5 w-5",
                    index < Math.round(item.rating)
                      ? "fill-amber-400 text-amber-400"
                      : "text-slate-300",
                  ].join(" ")}
                />
              ))}
            </div>
            <p className="text-sm text-slate-600">
              {item.rating.toFixed(1)} out of 5
            </p>
          </div>

          <p className="mt-5 text-3xl font-bold text-slate-900">
            {formatPrice(item.price)}
          </p>

          <p className="mt-4 leading-relaxed text-slate-600">
            {item.description}
          </p>

          <div className="mt-8 border-t border-slate-200 pt-6">
            <div className="flex flex-wrap items-center gap-4">
              <div
                role="group"
                aria-label="Quantity"
                className="flex items-center gap-2"
              >
                <button
                  type="button"
                  onClick={handleDecrease}
                  disabled={isOutOfStock || quantity <= 1}
                  aria-label="Decrease quantity"
                  className={quantityButtonClasses}
                >
                  <Minus className="h-4 w-4" aria-hidden="true" />
                </button>

                <span
                  aria-live="polite"
                  className="w-12 text-center text-lg font-semibold text-slate-900"
                >
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={() => handleIncrease(item.stock)}
                  disabled={isOutOfStock || quantity >= item.stock}
                  aria-label="Increase quantity"
                  className={quantityButtonClasses}
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              <p className="text-slate-600">
                Total:{" "}
                <span className="font-bold text-slate-900">
                  {formatPrice(item.price * quantity)}
                </span>
              </p>
            </div>

            <Button
              size="lg"
              fullWidth
              disabled={isOutOfStock}
              onClick={() => handleAddToCart(item)}
              className="mt-5 sm:w-auto"
            >
              <ShoppingCart className="h-5 w-5" aria-hidden="true" />
              Add to cart
            </Button>

            <p
              aria-live="polite"
              className="mt-3 min-h-6 text-sm font-medium text-green-700"
            >
              {addedMessage}
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                to={`/products/${item.id}/edit`}
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <Pencil className="h-4 w-4" aria-hidden="true" />
                Edit Product
              </Link>

              <Button
                size="lg"
                disabled={isDeleting}
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 sm:w-auto"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
                {isDeleting ? "Deleting..." : "Delete Product"}
              </Button>
            </div>

            {deleteError && (
              <p role="alert" className="mt-3 text-sm text-red-600">
                {deleteError}
              </p>
            )}
          </div>
        </div>
      </article>
    );
  };

  const renderContent = () => {
    if (productId === null) {
      return renderNotFound(
        "That product link is not valid",
        "The address does not contain a valid product ID. Head back to the list and pick a product.",
      );
    }

    if (isLoading) {
      return <DetailsSkeleton />;
    }

    if (isNotFound) {
      return renderNotFound(
        "Product not found",
        `We could not find a product with the id ${productId}. It may have been removed.`,
      );
    }

    if (error) {
      return (
        <ErrorMessage
          title="We could not load this product"
          message={`${error}. Check that the server is running, then try again.`}
          onRetry={handleRetry}
        />
      );
    }

    if (product === null) {
      return null;
    }

    return renderProduct(product);
  };

  return (
    <section aria-busy={productId !== null && isLoading}>
      <Link
        to="/products"
        className="inline-flex items-center gap-2 rounded text-sm font-medium text-slate-600 transition-colors hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to products
      </Link>

      <div className="mt-6">{renderContent()}</div>
    </section>
  );
}

export default ProductDetailsPage;
