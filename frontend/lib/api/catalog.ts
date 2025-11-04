import { httpClient } from "../http"

export interface Product {
  _id: string
  id: string
  name: string
  description: string
  price: number
  category: string[]
  brand?: string
  countInStock: number
  rating?: number
  numReviews?: number
  image: string[]
  thumbnail: string
  createdAt?: string
  embeddings?: number[]
}

export interface ProductsResponse {
  status: string
  count: number
  products: Product[]
  page?: number
  pages?: number
}

export interface ProductParams {
  page?: number
  limit?: number
  category?: string
  brand?: string
  minPrice?: number
  maxPrice?: number
  minRating?: number
  sort?: "price" | "-price" | "rating" | "-rating" | "createdAt" | "-createdAt"
  search?: string
}

export interface CreateProductData {
  name: string
  description: string
  price: number
  category: string[]
  brand?: string
  countInStock: number
  image: string[]
  thumbnail: string
}

export const catalogApi = {
  // Get all products with filters
  getProducts: async (params?: ProductParams): Promise<ProductsResponse> => {
    const response = await httpClient.get("/api/product", { params })
    return response.data
  },

  // Get single product by ID
  getProduct: async (id: string): Promise<Product> => {
    const response = await httpClient.get(`/api/product/${id}`)
    return response.data.product
  },

  // Get products by category
  getProductsByCategory: async (category: string, params?: ProductParams): Promise<ProductsResponse> => {
    const response = await httpClient.get(`/api/product/category/${category}`, { params })
    return response.data
  },

  // Create product (admin only)
  createProduct: async (data: FormData): Promise<Product> => {
    const response = await httpClient.post("/api/product", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data.product
  },

  // Update product (admin only)
  updateProduct: async (id: string, data: FormData): Promise<Product> => {
    const response = await httpClient.put(`/api/product/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data.product
  },

  // Delete product (admin only)
  deleteProduct: async (id: string): Promise<void> => {
    await httpClient.delete(`/api/product/${id}`)
  },

  // Get product categories (derive from products)
  getCategories: async (): Promise<string[]> => {
    const response = await httpClient.get("/api/product")
    const products = response.data.products as Product[]
    const categoriesSet = new Set<string>()
    products.forEach((p) => p.category.forEach((cat) => categoriesSet.add(cat)))
    return Array.from(categoriesSet).sort()
  },
}
