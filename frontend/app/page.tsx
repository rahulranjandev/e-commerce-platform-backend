import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            E-Commerce
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/search">
              <Button variant="ghost">Search</Button>
            </Link>
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Sign Up</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold mb-6">
            Shop Smarter with AI-Powered Search
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Discover products with semantic search, personalized recommendations,
            and intelligent product discovery
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/search">
              <Button size="lg">Start Shopping</Button>
            </Link>
            <Link href="/search?semantic=true">
              <Button size="lg" variant="outline">
                Try Semantic Search
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Semantic Search</CardTitle>
              <CardDescription>
                Find products using natural language
              </CardDescription>
            </CardHeader>
            <CardContent>
              Search for "comfortable running shoes for rainy weather" and get
              relevant results powered by AI vector search.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Smart Recommendations</CardTitle>
              <CardDescription>
                Personalized product suggestions
              </CardDescription>
            </CardHeader>
            <CardContent>
              Get product recommendations based on your browsing history and
              preferences with explainable AI.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Fast Checkout</CardTitle>
              <CardDescription>
                Secure payment processing
              </CardDescription>
            </CardHeader>
            <CardContent>
              Complete your purchase quickly with integrated Razorpay payment
              gateway and multiple payment options.
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>&copy; 2024 E-Commerce Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
