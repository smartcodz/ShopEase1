export const queryKeys = {
  products: {
    all: ["products"] as const,

    lists: () => ["products", "list"] as const,

    list: (limit?: number) => ["products", "list", { limit }] as const,

    detail: (id: string | number) => ["products", "detail", id] as const,
  },

  orders: {
    detail: (id: string | number) => ["orders", "detail", id] as const,
  },
} as const;
