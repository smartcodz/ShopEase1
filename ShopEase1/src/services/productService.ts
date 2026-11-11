import { api } from "./api";
import type { CreateProductInput, Product } from "../types/product";

interface GetProductsOptions {
  limit?: number;
}

type ApiResponse<T> = { success: boolean; data: T };

type ApiProduct = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  category: string;
  imageUrl: string | null;
};

type ApiProductList = {
  items: ApiProduct[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

function toProduct(product: ApiProduct): Product {
  return {
    id: product.id,
    name: product.name,
    price: product.price,
    category: product.category,
    image: product.imageUrl ?? "https://placehold.co/600x600?text=ShopEase",
    description: product.description ?? "No description available.",
    rating: 0,
    stock: product.stock,
  };
}

function toApiInput(input: CreateProductInput) {
  return {
    name: input.name,
    description: input.description,
    price: input.price,
    stock: input.stock,
    category: input.category,
    imageUrl: input.image || undefined,
  };
}

export async function getProducts(
  options: GetProductsOptions = {},
): Promise<Product[]> {
  const response = await api.get<ApiResponse<ApiProductList>>("/products/", {
    params: { limit: options.limit },
  });
  return response.data.data.items.map(toProduct);
}

export async function getProductById(id: string | number): Promise<Product> {
  const response = await api.get<ApiResponse<ApiProduct>>(`/products/${id}`);
  return toProduct(response.data.data);
}

export async function createProduct(
  input: CreateProductInput,
): Promise<Product> {
  const response = await api.post<ApiResponse<ApiProduct>>("/products/", toApiInput(input));
  return toProduct(response.data.data);
}

export async function updateProduct(
  id: string | number,
  input: CreateProductInput,
): Promise<Product> {
  const response = await api.patch<ApiResponse<ApiProduct>>(`/products/${id}`, toApiInput(input));
  return toProduct(response.data.data);
}

export async function deleteProduct(id: string | number): Promise<void> {
  await api.delete(`/products/${id}`);
}
