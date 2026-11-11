export type Category = string;

export type CategoryFilter = Category | "All";

export interface Product {
  // The live API uses UUIDs. Keeping number here as well preserves the local
  // mock-data tests while the app transitions to the deployed backend.
  id: string | number;
  name: string;
  price: number;
  category: Category;
  image: string;
  description: string;
  rating: number;
  stock: number;
}

export type CreateProductInput = Omit<Product, "id">;

// Text boxes always give strings, so form values are all strings.
export type ProductFormValues = Record<keyof CreateProductInput, string>;

// One optional message per field.
export type ProductFormErrors = Partial<
  Record<keyof CreateProductInput, string>
>;
