import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import ProductForm from "../components/products/ProductForm";
import Toast from "../components/ui/Toast";
import { toCreateProductInput } from "../lib/utils";
import { getErrorMessage } from "../services/api";
import { createProduct } from "../services/productService";
import type { ProductFormValues } from "../types/product";

const REDIRECT_DELAY_MS = 1500;

function CreateProductPage() {
  const navigate = useNavigate();

  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [createdName, setCreatedName] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // After success, wait a moment so the Toast can be seen, then go to the list.
  useEffect(() => {
    if (createdName === null) {
      return;
    }

    const timer = setTimeout(() => {
      navigate("/products");
    }, REDIRECT_DELAY_MS);

    // Cleanup: if the user leaves this page first, cancel the redirect.
    return () => clearTimeout(timer);
  }, [createdName, navigate]);

  const handleSubmit = async (values: ProductFormValues): Promise<void> => {
    try {
      setIsSaving(true);
      setSubmitError(null);

      const input = toCreateProductInput(values);
      const created = await createProduct(input);

      setCreatedName(created.name);
    } catch (err: unknown) {
      setSubmitError(getErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="mx-auto max-w-2xl">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">
        Add a Product
      </h1>
      <p className="mt-1 text-slate-600">
        Fill in the details below to add a new product to the store.
      </p>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <ProductForm
          onSubmit={handleSubmit}
          isSaving={isSaving || createdName !== null}
        />
      </div>

      {createdName !== null && (
        <Toast message={`"${createdName}" was added to the store.`} />
      )}

      {submitError !== null && (
        <Toast
          variant="error"
          message={`We could not save the product. ${submitError}.`}
          onClose={() => setSubmitError(null)}
        />
      )}
    </section>
  );
}

export default CreateProductPage;
