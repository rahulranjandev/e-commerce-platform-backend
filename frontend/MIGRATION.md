# Migration Guide

This guide explains how to extend the e-commerce frontend with new features, entities, and integrate them with search and recommendations.

## Table of Contents
1. [Adding a New Entity](#adding-a-new-entity)
2. [Integrating with Search](#integrating-with-search)
3. [Adding Recommendations](#adding-recommendations)
4. [Creating New Pages](#creating-new-pages)
5. [Admin Panel Extensions](#admin-panel-extensions)

## Adding a New Entity

### Example: Adding a "Wishlist" feature

#### 1. Define the TypeScript Interface

Create `lib/api/wishlist.ts`:

```typescript
import { httpClient } from "../http"
import { Product } from "./catalog"

export interface WishlistItem {
  _id: string
  user: string
  product: Product
  addedAt: string
}

export const wishlistApi = {
  getWishlist: async (): Promise<WishlistItem[]> => {
    const response = await httpClient.get("/api/wishlist")
    return response.data.items
  },

  addToWishlist: async (productId: string): Promise<WishlistItem> => {
    const response = await httpClient.post("/api/wishlist", { productId })
    return response.data.item
  },

  removeFromWishlist: async (itemId: string): Promise<void> => {
    await httpClient.delete(`/api/wishlist/${itemId}`)
  },
}
```

#### 2. Add Query Keys

Update `lib/queryClient.ts`:

```typescript
export const queryKeys = {
  // ... existing keys
  wishlist: {
    all: () => ["wishlist"] as const,
    byId: (id: string) => ["wishlist", id] as const,
  },
}
```

#### 3. Create Validation Schema

Create `lib/validations/wishlist.ts`:

```typescript
import { z } from "zod"

export const addToWishlistSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
})

export type AddToWishlistInput = z.infer<typeof addToWishlistSchema>
```

#### 4. Create UI Components

Create `components/wishlist/wishlist-button.tsx`:

```typescript
"use client"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { wishlistApi } from "@/lib/api/wishlist"
import { queryKeys } from "@/lib/queryClient"
import { useToast } from "@/hooks/use-toast"

interface WishlistButtonProps {
  productId: string
  isInWishlist?: boolean
}

export function WishlistButton({ productId, isInWishlist = false }: WishlistButtonProps) {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const [inWishlist, setInWishlist] = useState(isInWishlist)

  const addMutation = useMutation({
    mutationFn: () => wishlistApi.addToWishlist(productId),
    onSuccess: () => {
      setInWishlist(true)
      queryClient.invalidateQueries({ queryKey: queryKeys.wishlist.all() })
      toast({
        title: "Added to wishlist",
        description: "Product added to your wishlist",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add to wishlist",
        variant: "destructive",
      })
    },
  })

  const removeMutation = useMutation({
    mutationFn: () => wishlistApi.removeFromWishlist(productId),
    onSuccess: () => {
      setInWishlist(false)
      queryClient.invalidateQueries({ queryKey: queryKeys.wishlist.all() })
      toast({
        title: "Removed from wishlist",
        description: "Product removed from your wishlist",
      })
    },
  })

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => (inWishlist ? removeMutation.mutate() : addMutation.mutate())}
      disabled={addMutation.isPending || removeMutation.isPending}
    >
      <Heart className={inWishlist ? "fill-current" : ""} />
    </Button>
  )
}
```

#### 5. Create Page

Create `app/(app)/wishlist/page.tsx`:

```typescript
"use client"

import { useQuery } from "@tanstack/react-query"
import { wishlistApi } from "@/lib/api/wishlist"
import { queryKeys } from "@/lib/queryClient"
import { Card } from "@/components/ui/card"

export default function WishlistPage() {
  const { data: wishlist, isLoading } = useQuery({
    queryKey: queryKeys.wishlist.all(),
    queryFn: wishlistApi.getWishlist,
  })

  if (isLoading) return <div>Loading...</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Wishlist</h1>
      <div className="grid md:grid-cols-3 gap-6">
        {wishlist?.map((item) => (
          <Card key={item._id}>
            {/* Render product card */}
          </Card>
        ))}
      </div>
    </div>
  )
}
```

## Integrating with Search

### Making an Entity Searchable

#### 1. Add Embeddings to Backend Model

Update your backend model to include embeddings:

```typescript
// Backend: models/productModel.ts
const productSchema = new Schema({
  // ... existing fields
  embeddings: {
    type: [Number],
    index: true, // Add index for vector search
  },
})
```

#### 2. Generate Embeddings

Use the backend's embedding generation utility:

```typescript
// Backend: utils/generateEmbeddings.ts
import { generate_vectors } from './generateEmbeddings'

// When creating/updating a product
const text = `${product.name} ${product.description} ${product.category.join(' ')}`
const embeddings = await generate_vectors(text)
product.embeddings = embeddings
```

#### 3. Create Vector Index

In MongoDB Atlas, create a vector search index:

```json
{
  "fields": [
    {
      "type": "vector",
      "path": "embeddings",
      "numDimensions": 384,
      "similarity": "cosine"
    }
  ]
}
```

#### 4. Add Search Endpoint

Frontend API client:

```typescript
// lib/api/mysearch.ts
export const mySearchApi = {
  semanticSearch: async (query: string) => {
    const response = await httpClient.post("/mysearch", {}, {
      params: { vs: query }
    })
    return response.data.data
  }
}
```

## Adding Recommendations

### Collaborative Filtering Example

#### 1. Backend Recommendation Endpoint

Create backend endpoint:

```typescript
// Backend: controllers/recommendController.ts
export class RecommendController {
  public async getRecommendations(req: Request, res: Response) {
    const userId = req.user.id
    
    // Get user's purchase/view history
    const userHistory = await getUserHistory(userId)
    
    // Find similar users
    const similarUsers = await findSimilarUsers(userId)
    
    // Get products similar users liked
    const recommendations = await getCollaborativeRecommendations(
      userHistory,
      similarUsers
    )
    
    res.json({ recommendations })
  }
}
```

#### 2. Frontend Integration

```typescript
// lib/api/recommend.ts
export const recommendApi = {
  getPersonalized: async (userId?: string) => {
    const response = await httpClient.get("/api/recommend/personalized", {
      params: { userId }
    })
    return response.data.recommendations
  },

  getSimilar: async (productId: string) => {
    const response = await httpClient.get(`/api/recommend/similar/${productId}`)
    return response.data.recommendations
  }
}
```

#### 3. Display Recommendations

```typescript
// components/recommendations/recs-rail.tsx
"use client"

import { useQuery } from "@tanstack/react-query"
import { recommendApi } from "@/lib/api/recommend"
import { ProductCard } from "@/components/product/product-card"

export function RecommendationsRail({ userId }: { userId?: string }) {
  const { data: recs } = useQuery({
    queryKey: ["recommendations", userId],
    queryFn: () => recommendApi.getPersonalized(userId),
  })

  if (!recs || recs.length === 0) return null

  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold mb-4">Recommended for You</h2>
      <div className="grid grid-cols-4 gap-4">
        {recs.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
```

## Creating New Pages

### Public vs Protected Routes

#### Public Route (no auth required)

```typescript
// app/(public)/about/page.tsx
export default function AboutPage() {
  return <div>About Us</div>
}
```

#### Protected Route (auth required)

```typescript
// app/(app)/profile/page.tsx
"use client"

import { useQuery } from "@tanstack/react-query"
import { authApi } from "@/lib/api/auth"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const router = useRouter()
  
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: authApi.me,
    retry: false,
  })

  if (error) {
    router.push("/login")
    return null
  }

  if (isLoading) return <div>Loading...</div>

  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
    </div>
  )
}
```

#### Admin Route

```typescript
// app/(admin)/dashboard/page.tsx
"use client"

import { useQuery } from "@tanstack/react-query"
import { authApi } from "@/lib/api/auth"
import { redirect } from "next/navigation"

export default function AdminDashboard() {
  const { data: user } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: authApi.me,
  })

  if (!user?.isAdmin) {
    redirect("/")
  }

  return <div>Admin Dashboard</div>
}
```

## Admin Panel Extensions

### Adding Admin CRUD for New Entity

#### 1. Create Admin API Functions

```typescript
// lib/api/admin.ts
export const adminApi = {
  // List all entities
  listEntities: async (params?: any) => {
    const response = await httpClient.get("/api/admin/entities", { params })
    return response.data
  },

  // Create entity
  createEntity: async (data: any) => {
    const response = await httpClient.post("/api/admin/entities", data)
    return response.data
  },

  // Update entity
  updateEntity: async (id: string, data: any) => {
    const response = await httpClient.put(`/api/admin/entities/${id}`, data)
    return response.data
  },

  // Delete entity
  deleteEntity: async (id: string) => {
    await httpClient.delete(`/api/admin/entities/${id}`)
  },
}
```

#### 2. Create Admin Table Component

```typescript
// components/admin/entity-table.tsx
"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { adminApi } from "@/lib/api/admin"
import { Button } from "@/components/ui/button"

export function EntityTable() {
  const queryClient = useQueryClient()
  
  const { data: entities } = useQuery({
    queryKey: ["admin", "entities"],
    queryFn: adminApi.listEntities,
  })

  const deleteMutation = useMutation({
    mutationFn: adminApi.deleteEntity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "entities"] })
    },
  })

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {entities?.map((entity: any) => (
          <tr key={entity.id}>
            <td>{entity.name}</td>
            <td>
              <Button onClick={() => deleteMutation.mutate(entity.id)}>
                Delete
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
```

## Best Practices

### 1. Type Safety
Always define TypeScript interfaces for your data:

```typescript
interface MyEntity {
  id: string
  name: string
  createdAt: string
}
```

### 2. Error Handling
Use consistent error handling:

```typescript
try {
  const result = await api.call()
} catch (error: any) {
  toast({
    title: "Error",
    description: error.message || "Something went wrong",
    variant: "destructive",
  })
}
```

### 3. Loading States
Always handle loading states:

```typescript
const { data, isLoading, error } = useQuery(...)

if (isLoading) return <Skeleton />
if (error) return <ErrorMessage error={error} />
```

### 4. Optimistic Updates
For better UX, use optimistic updates:

```typescript
const mutation = useMutation({
  mutationFn: api.update,
  onMutate: async (newData) => {
    // Cancel outgoing queries
    await queryClient.cancelQueries({ queryKey })
    
    // Snapshot previous value
    const previous = queryClient.getQueryData(queryKey)
    
    // Optimistically update
    queryClient.setQueryData(queryKey, newData)
    
    return { previous }
  },
  onError: (err, variables, context) => {
    // Rollback on error
    queryClient.setQueryData(queryKey, context?.previous)
  },
})
```

### 5. Code Organization
Keep your code organized:
- One API service per domain
- Separate components by feature
- Use barrel exports (`index.ts`) for clean imports
- Keep components small and focused

## Troubleshooting

### Query Not Updating
- Check if you're invalidating queries after mutations
- Verify query keys are consistent
- Use React Query DevTools to debug

### TypeScript Errors
- Ensure all interfaces are properly defined
- Use `as const` for query keys
- Check for missing type imports

### Performance Issues
- Use `staleTime` to reduce refetches
- Implement pagination for large lists
- Use React.memo for expensive components
- Consider lazy loading images

## Next Steps

1. Implement authentication middleware
2. Add error boundaries
3. Set up monitoring and analytics
4. Add E2E tests with Playwright
5. Optimize bundle size
6. Set up CI/CD pipeline
