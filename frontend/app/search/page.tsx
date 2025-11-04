"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { searchApi } from "@/lib/api/search"
import { catalogApi } from "@/lib/api/catalog"
import { queryKeys } from "@/lib/queryClient"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { formatPrice } from "@/lib/utils"
import env from "@/lib/env"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "")
  const [useSemanticSearch, setUseSemanticSearch] = useState(
    searchParams.get("semantic") === "true" || env.NEXT_PUBLIC_ENABLE_SEMANTIC_SEARCH
  )
  const [activeQuery, setActiveQuery] = useState(searchParams.get("q") || "")

  // Semantic search query
  const { data: semanticResults, isLoading: semanticLoading } = useQuery({
    queryKey: queryKeys.search.semantic(activeQuery, { enabled: useSemanticSearch }),
    queryFn: () => searchApi.semanticSearch({ query: activeQuery }),
    enabled: useSemanticSearch && activeQuery.length > 0,
  })

  // Regular search query
  const { data: regularResults, isLoading: regularLoading } = useQuery({
    queryKey: queryKeys.search.regular(activeQuery, { enabled: !useSemanticSearch }),
    queryFn: () => searchApi.regularSearch(activeQuery),
    enabled: !useSemanticSearch && activeQuery.length > 0,
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setActiveQuery(searchQuery)
  }

  const results = useSemanticSearch ? semanticResults : regularResults
  const isLoading = useSemanticSearch ? semanticLoading : regularLoading

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            E-Commerce
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/cart">
              <Button variant="ghost">Cart</Button>
            </Link>
            <Link href="/account">
              <Button variant="outline">Account</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Search Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="search"
                placeholder={
                  useSemanticSearch
                    ? "Try: comfortable running shoes for rainy weather"
                    : "Search products..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button type="submit">Search</Button>
            </div>

            {env.NEXT_PUBLIC_ENABLE_SEMANTIC_SEARCH && (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="semantic"
                  checked={useSemanticSearch}
                  onChange={(e) => setUseSemanticSearch(e.target.checked)}
                  className="h-4 w-4"
                />
                <Label htmlFor="semantic" className="cursor-pointer">
                  Use Semantic Search (AI-powered natural language search)
                </Label>
              </div>
            )}
          </form>

          {/* Results */}
          <div className="mt-8">
            {isLoading && (
              <div className="text-center py-12">
                <p>Searching...</p>
              </div>
            )}

            {!isLoading && activeQuery && results && results.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-lg font-semibold">No results found</h3>
                <p className="text-muted-foreground mt-2">
                  Try different keywords or disable semantic search
                </p>
              </div>
            )}

            {!isLoading && results && results.length > 0 && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-muted-foreground">
                    {results.length} result{results.length !== 1 ? "s" : ""} found
                    {useSemanticSearch && " using semantic search"}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.map((product: any, index: number) => (
                    <Card key={product._id || product.id || index}>
                      <CardHeader>
                        <CardTitle className="text-lg">{product.name}</CardTitle>
                        {useSemanticSearch && product.score && (
                          <CardDescription>
                            Relevance: {(product.score * 100).toFixed(0)}%
                          </CardDescription>
                        )}
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                          {product.description}
                        </p>
                        {product.price && (
                          <p className="text-lg font-bold mb-2">
                            {formatPrice(product.price)}
                          </p>
                        )}
                        {product.category && product.category.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-4">
                            {product.category.map((cat: string) => (
                              <span
                                key={cat}
                                className="text-xs bg-muted px-2 py-1 rounded"
                              >
                                {cat}
                              </span>
                            ))}
                          </div>
                        )}
                        <Link href={`/product/${product._id || product.id}`}>
                          <Button className="w-full">View Details</Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}

            {!activeQuery && (
              <div className="text-center py-12">
                <h3 className="text-lg font-semibold">Start searching</h3>
                <p className="text-muted-foreground mt-2">
                  Enter a search query to find products
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
