import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { ArrowLeft } from "lucide-react";

import Button from "../components/ui/Button";
import { getErrorMessage } from "../services/api";
import { useProduct, useUpdateProduct } from "../hooks/useProducts";
import type {
  Category,
  CreateProductInput,
  ProductFormValues,
} from "../types/product";

const categories: Category[] = ["Electronics", "Fashion", "Home", "Beauty"];

function EditProductPage() {
  const { id } = useParams();
  const productId = id && id.trim() !== "" ? id : null;

  const {
    data: product,
    isLoading,
    isError,
    error,
    refetch,
  } = useProduct(productId ?? "");

  if (productId === null) {
    return <p className="text-red-600">Invalid product ID.</p>;
  }

  if (isLoading) {
    return <p className="py-10 text-slate-600">Loading product...</p>;
  }

  if (isError) {
    return (
      <div className="space-y-4">
        <p className="text-red-600">{getErrorMessage(error)}</p>
        <Button onClick={() => void refetch()}>Try Again</Button>
      </div>
    );
  }

  if (!product) {
    return <p>Product not found.</p>;
  }

  return <EditProductForm product={product} productId={productId} />;
}

function EditProductForm({
  product,
  productId,
}: {
  product: NonNullable<ReturnType<typeof useProduct>["data"]>;
  productId: string;
}) {
  const navigate = useNavigate();
  const {
    mutate,
    isPending: isSaving,
    isError: isSaveError,
    error: saveError,
  } = useUpdateProduct();
  const [form, setForm] = useState<ProductFormValues>(() => ({
    name: product.name,
    price: String(product.price),
    category: product.category,
    image: product.image,
    description: product.description,
    rating: String(product.rating),
    stock: String(product.stock),
  }));
  const [validationError, setValidationError] = useState("");

  const handleChange = (field: keyof CreateProductInput, value: string) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setValidationError("");

    const price = Number(form.price);
    const rating = Number(form.rating);
    const stock = Number(form.stock);

    if (
      !Number.isFinite(price) ||
      price < 0 ||
      !Number.isFinite(rating) ||
      rating < 0 ||
      rating > 5 ||
      !Number.isInteger(stock) ||
      stock < 0
    ) {
      setValidationError(
        "Enter a valid price, a rating between 0 and 5, and a whole-number stock of 0 or more.",
      );
      return;
    }

    const input: CreateProductInput = {
      name: form.name.trim(),
      price,
      category: form.category as Category,
      image: form.image.trim(),
      description: form.description.trim(),
      rating,
      stock,
    };

    if (!input.name || !input.image || !input.description) {
      setValidationError("Please complete all product fields.");
      return;
    }

    mutate(
      { id: productId, input },
      {
        onSuccess: () => {
          navigate(`/products/${productId}`);
        },
      },
    );
  };

  const inputClasses =
    "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200";

  return (
    <section className="mx-auto max-w-2xl">
      <Link
        to={`/products/${productId}`}
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to product
      </Link>

      <h1 className="mt-6 text-3xl font-bold text-slate-900">Edit Product</h1>

      <p className="mt-2 text-slate-600">Update the product details below.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label htmlFor="name" className="font-medium">
            Product name
          </label>
          <input
            id="name"
            required
            value={form.name}
            onChange={(event) => handleChange("name", event.target.value)}
            className={inputClasses}
          />
        </div>

        <div>
          <label htmlFor="price" className="font-medium">
            Price
          </label>
          <input
            id="price"
            type="number"
            min="0"
            step="0.01"
            required
            value={form.price}
            onChange={(event) => handleChange("price", event.target.value)}
            className={inputClasses}
          />
        </div>

        <div>
          <label htmlFor="category" className="font-medium">
            Category
          </label>
          <select
            id="category"
            value={form.category}
            onChange={(event) => handleChange("category", event.target.value)}
            className={inputClasses}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="image" className="font-medium">
            Image URL
          </label>
          <input
            id="image"
            type="url"
            required
            value={form.image}
            onChange={(event) => handleChange("image", event.target.value)}
            className={inputClasses}
          />
        </div>

        <div>
          <label htmlFor="description" className="font-medium">
            Description
          </label>
          <textarea
            id="description"
            required
            rows={4}
            value={form.description}
            onChange={(event) =>
              handleChange("description", event.target.value)
            }
            className={inputClasses}
          />
        </div>

        <div>
          <label htmlFor="rating" className="font-medium">
            Rating (0–5)
          </label>
          <input
            id="rating"
            type="number"
            min="0"
            max="5"
            step="0.1"
            required
            value={form.rating}
            onChange={(event) => handleChange("rating", event.target.value)}
            className={inputClasses}
          />
        </div>

        <div>
          <label htmlFor="stock" className="font-medium">
            Stock quantity
          </label>
          <input
            id="stock"
            type="number"
            min="0"
            step="1"
            required
            value={form.stock}
            onChange={(event) => handleChange("stock", event.target.value)}
            className={inputClasses}
          />
        </div>

        {(validationError || isSaveError) && (
          <p role="alert" className="text-sm text-red-600">
            {validationError || getErrorMessage(saveError)}
          </p>
        )}

        <Button type="submit" size="lg" fullWidth disabled={isSaving}>
          {isSaving ? "Saving Changes..." : "Save Changes"}
        </Button>
      </form>
    </section>
  );
}

export default EditProductPage;
