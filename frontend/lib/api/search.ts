import { httpClient, vectorClient } from "../http"
import { Product } from "./catalog"

export interface SemanticSearchResult {
  _id?: string
  id?: string
  name: string
  description: string
  category: string[]
  score: number
  thumbnail?: string
  price?: number
}

export interface SearchParams {
  query: string
  topK?: number
  minScore?: number
}

export const searchApi = {
  // Semantic/Vector search using the backend vector search endpoint
  semanticSearch: async (params: SearchParams): Promise<SemanticSearchResult[]> => {
    const response = await httpClient.post("/vsearch", {}, {
      params: { vs: params.query }
    })
    return response.data.data
  },

  // Regular text search (using catalog API with search param)
  regularSearch: async (query: string): Promise<Product[]> => {
    const response = await httpClient.get("/api/product", {
      params: { search: query }
    })
    return response.data.products
  },

  // Get search suggestions (can be implemented based on common searches or autocomplete)
  getSuggestions: async (prefix: string): Promise<string[]> => {
    // This could be implemented with a dedicated endpoint
    // For now, return empty array as backend doesn't have this endpoint
    return []
  },
}
