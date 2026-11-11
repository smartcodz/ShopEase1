import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link } from "react-router";
import { LoaderCircle } from "lucide-react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Textarea from "../ui/Textarea";
import { CATEGORIES } from "../../lib/constants";
import { validateProductForm } from "../../lib/utils";
import type { ProductFormErrors, ProductFormValues } from "../../types/product";

interface ProductFormProps {
  onSubmit: (values: ProductFormValues) => void;
  isSaving?: boolean;
}

type FieldChangeEvent = ChangeEvent<
  HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
>;

// Every field starts as an empty string, so inputs are always "controlled".
const INITIAL_VALUES: ProductFormValues = {
  name: "",
  price: "",
  category: "",
  image: "",
  stock: "",
  rating: "",
  description: "",
};

function ProductForm({ onSubmit, isSaving = false }: ProductFormProps) {
  const [values, setValues] = useState<ProductFormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<ProductFormErrors>({});

  // Curried: handleChange("name") gives back the real change handler for that field.
  const handleChange =
    (field: keyof ProductFormValues) =>
    (event: FieldChangeEvent): void => {
      const { value } = event.target;
      setValues((previous) => ({ ...previous, [field]: value }));
      setErrors((previous) => ({ ...previous, [field]: undefined }));
    };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    if (isSaving) {
      return;
    }

    const validationErrors = validateProductForm(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-5">
      {/* A disabled fieldset disables every field inside it at once. */}
      <fieldset disabled={isSaving} className="grid min-w-0 gap-5">
        <legend className="sr-only">Product details</legend>

        <Input
          label="Name"
          name="name"
          type="text"
          placeholder="e.g. Wireless Headphones"
          autoComplete="off"
          value={values.name}
          onChange={handleChange("name")}
          error={errors.name}
          required
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            label="Price (USD)"
            name="price"
            type="number"
            min={0}
            step={0.01}
            placeholder="0.00"
            value={values.price}
            onChange={handleChange("price")}
            error={errors.price}
            required
          />
          <Select
            label="Category"
            name="category"
            value={values.category}
            onChange={handleChange("category")}
            error={errors.category}
            required
          >
            <option value="">Choose a category</option>
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Select>
        </div>

        <Input
          label="Image URL"
          name="image"
          type="url"
          placeholder="https://picsum.photos/seed/my-product/600/600"
          hint="Paste a link to a square photo, about 600 by 600 pixels."
          value={values.image}
          onChange={handleChange("image")}
          error={errors.image}
          required
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            label="Stock"
            name="stock"
            type="number"
            min={0}
            step={1}
            placeholder="0"
            value={values.stock}
            onChange={handleChange("stock")}
            error={errors.stock}
            required
          />
          <Input
            label="Rating (1 to 5)"
            name="rating"
            type="number"
            min={1}
            max={5}
            step={0.1}
            placeholder="4.5"
            value={values.rating}
            onChange={handleChange("rating")}
            error={errors.rating}
            required
          />
        </div>

        <Textarea
          label="Description"
          name="description"
          placeholder="Describe the product in one or two sentences."
          value={values.description}
          onChange={handleChange("description")}
          error={errors.description}
          required
        />
      </fieldset>

      <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
        <Link
          to="/products"
          className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
        >
          Cancel
        </Link>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? (
            <>
              <LoaderCircle
                className="h-4 w-4 animate-spin"
                aria-hidden="true"
              />
              Saving...
            </>
          ) : (
            "Create product"
          )}
        </Button>
      </div>
    </form>
  );
}

export default ProductForm;
