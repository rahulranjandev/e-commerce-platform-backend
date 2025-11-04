import { Product } from "./catalog"

// Note: The backend doesn't have dedicated recommendation endpoints
// These would need to be added or we simulate them using existing APIs

export interface RecommendationResult extends Product {
  reason?: string
  score?: number
}

export const recommendApi = {
  // Get personalized recommendations for user
  // Currently simulating with random products or most popular
  forUser: async (userId?: string): Promise<RecommendationResult[]> => {
    // In a real implementation, this would call a recommendation endpoint
    // For now, we'll return empty array or fetch from catalog
    return []
  },

  // Get similar products (using vector similarity)
  // This would ideally use product embeddings
  similar: async (productId: string): Promise<RecommendationResult[]> => {
    // In a real implementation, this would use vector similarity
    // For now, return empty array
    return []
  },

  // Chat-style recommendations (optional)
  chat: async (messages: { role: string; content: string }[]): Promise<RecommendationResult[]> => {
    // This would need a streaming endpoint
    return []
  },
}
