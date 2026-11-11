// Every key starts with "products", so later we can refresh ALL product data at once.
export const queryKeys = {
  products: {
    all: ["products"] as const,
    lists: ["products", "list"] as const, // matches every list, whatever its limit
    list: (limit?: number) => ["products", "list", { limit }] as const,
    detail: (id: string | number) => ["products", "detail", id] as const,
  },
} as const;
