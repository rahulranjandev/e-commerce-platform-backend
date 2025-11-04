import { QueryClient, DefaultOptions } from "@tanstack/react-query"

const queryConfig: DefaultOptions = {
  queries: {
    refetchOnWindowFocus: false,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  },
}

export const queryClient = new QueryClient({ defaultOptions: queryConfig })

// Query key factory for consistency
export const queryKeys = {
  auth: {
    me: ["auth", "me"] as const,
  },
  products: {
    all: (params?: any) => ["products", params] as const,
    byId: (id: string) => ["product", id] as const,
    byCategory: (category: string, params?: any) => ["products", "category", category, params] as const,
  },
  search: {
    semantic: (query: string, params?: any) => ["search", "semantic", query, params] as const,
    regular: (query: string, params?: any) => ["search", "regular", query, params] as const,
  },
  recommendations: {
    forUser: (userId?: string) => ["recommendations", "user", userId] as const,
    similar: (productId: string) => ["recommendations", "similar", productId] as const,
  },
  orders: {
    all: (params?: any) => ["orders", params] as const,
    byId: (id: string) => ["order", id] as const,
  },
  reviews: {
    byProduct: (productId: string, params?: any) => ["reviews", "product", productId, params] as const,
  },
}
