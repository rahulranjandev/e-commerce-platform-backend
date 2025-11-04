# E-Commerce Platform - Frontend

Modern Next.js 14+ frontend with AI-powered search and recommendations for the e-commerce platform.

## Features

- **Next.js 14+ App Router** with TypeScript
- **AI-Powered Search**: Semantic vector search using natural language queries
- **Smart Recommendations**: Personalized product recommendations
- **TanStack Query** for efficient data fetching and caching
- **shadcn/ui** components with Tailwind CSS
- **Dark Mode** support with next-themes
- **Type-safe API** clients with Zod validation
- **Responsive Design** mobile-first approach
- **JWT Authentication** with automatic token refresh

## Prerequisites

- Node.js 18+ or higher
- npm or pnpm
- Running backend services (see backend README)

## Environment Setup

Create a `.env.local` file based on `.env.example`:

```bash
cp .env.example .env.local
```

Configure the environment variables:

```env
# Backend API URL (Node.js/Express backend)
NEXT_PUBLIC_API_URL=http://localhost:3333

# Vector search backend (FastAPI service) - optional
NEXT_PUBLIC_VECTORS_URL=http://localhost:8000

# Feature flags
NEXT_PUBLIC_ENABLE_SEMANTIC_SEARCH=true
NEXT_PUBLIC_ENABLE_CHAT_RECS=false
```

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build

```bash
npm run build
```

## Production

```bash
npm run start
```

## Project Structure

```
frontend/
├── app/                      # Next.js App Router pages
│   ├── (public)/            # Public pages (landing, search)
│   ├── (auth)/              # Auth pages (login, register)
│   ├── (app)/               # Protected app pages (cart, orders, account)
│   ├── (admin)/             # Admin pages (admin panel)
│   ├── api/                 # API route handlers (if needed)
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   └── providers.tsx        # React Query & Theme providers
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── shell/               # Layout components (Header, Sidebar)
│   ├── search/              # Search-related components
│   ├── product/             # Product-related components
│   └── forms/               # Form components
├── lib/
│   ├── api/                 # API service layers
│   │   ├── auth.ts          # Authentication API
│   │   ├── catalog.ts       # Product catalog API
│   │   ├── orders.ts        # Order management API
│   │   ├── search.ts        # Search API (vector + regular)
│   │   └── recommend.ts     # Recommendations API
│   ├── validations/         # Zod validation schemas
│   ├── env.ts               # Environment validation
│   ├── http.ts              # HTTP client with interceptors
│   ├── queryClient.ts       # TanStack Query configuration
│   └── utils.ts             # Utility functions
├── hooks/                   # Custom React hooks
└── public/                  # Static assets

## API Services

### Authentication (`lib/api/auth.ts`)
- `login(credentials)` - User login
- `register(data)` - User registration
- `me()` - Get current user
- `logout()` - User logout
- `forgotPassword(email)` - Request password reset
- `resetPassword(token, password)` - Reset password

### Catalog (`lib/api/catalog.ts`)
- `getProducts(params)` - Get product list with filters
- `getProduct(id)` - Get single product
- `getProductsByCategory(category)` - Get products by category
- `createProduct(data)` - Create product (admin)
- `updateProduct(id, data)` - Update product (admin)
- `deleteProduct(id)` - Delete product (admin)

### Orders (`lib/api/orders.ts`)
- `getOrders()` - Get user orders
- `getOrder(id)` - Get single order
- `createOrder(data)` - Create new order
- `verifyPayment(orderId, data)` - Verify Razorpay payment
- `updateOrderStatus(orderId, status)` - Update order status
- `cancelOrder(orderId)` - Cancel order

### Search (`lib/api/search.ts`)
- `semanticSearch(params)` - Vector-based semantic search
- `regularSearch(query)` - Traditional text search
- `getSuggestions(prefix)` - Get search suggestions

## Semantic Search

The platform supports AI-powered semantic search that understands natural language queries:

```typescript
// Enable semantic search in your queries
const results = await searchApi.semanticSearch({
  query: "comfortable running shoes for rainy weather",
  topK: 10,
  minScore: 0.6
})
```

### How it works:
1. User enters a natural language query
2. Query is sent to the vector search endpoint
3. Backend generates embeddings using ML models
4. Vector similarity search finds relevant products
5. Results are ranked by relevance score

## Authentication Flow

The app uses JWT tokens stored in httpOnly cookies:

1. User logs in with credentials
2. Backend returns access token (stored in cookie)
3. Refresh token is also stored in httpOnly cookie
4. HTTP client automatically includes cookies in requests
5. On 401 errors, client attempts token refresh
6. If refresh fails, user is redirected to login

## Adding New Features

### Adding a New Page

1. Create page in appropriate directory:
```bash
mkdir -p app/(app)/my-page
touch app/(app)/my-page/page.tsx
```

2. Implement the page component:
```typescript
export default function MyPage() {
  return <div>My Page Content</div>
}
```

### Adding a New API Endpoint

1. Create service in `lib/api/`:
```typescript
// lib/api/myservice.ts
import { httpClient } from "../http"

export const myServiceApi = {
  getData: async () => {
    const response = await httpClient.get("/my-endpoint")
    return response.data
  }
}
```

2. Add query keys:
```typescript
// lib/queryClient.ts
export const queryKeys = {
  // ... existing keys
  myService: {
    all: () => ["myService"] as const,
  }
}
```

3. Use in component:
```typescript
const { data } = useQuery({
  queryKey: queryKeys.myService.all(),
  queryFn: myServiceApi.getData
})
```

## Backend Integration

This frontend is designed to work with the existing Node.js/Express backend:

- **Auth Service**: JWT-based authentication
- **Catalog Service**: Product CRUD operations
- **Order Service**: Order management and Razorpay integration
- **Vector Search**: FastAPI service for semantic search

### Backend Endpoints Expected

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/product` - List products
- `GET /api/product/:id` - Get product details
- `POST /api/order` - Create order
- `POST /vsearch?vs=query` - Vector search

## Troubleshooting

### Environment Variables Not Loading
Make sure your `.env.local` file is in the root of the frontend directory and restart the dev server.

### CORS Errors
Ensure your backend allows the frontend origin in CORS configuration:
```javascript
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}))
```

### Authentication Issues
- Check that cookies are being set with `httpOnly` flag
- Verify backend sets proper CORS headers for credentials
- Ensure `withCredentials: true` in HTTP client

## License

MIT
