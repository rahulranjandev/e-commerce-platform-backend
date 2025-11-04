# E-Commerce Platform - Full Stack Guide

A modern, production-ready e-commerce platform with AI-powered semantic search, personalized recommendations, and a comprehensive full-stack architecture.

## 🏗️ Architecture Overview

This monorepo consists of:

1. **Backend (Node.js/Express)** - RESTful API with MongoDB
2. **Frontend (Next.js 14+)** - Modern React app with App Router
3. **Vector Search Service** - FastAPI service for AI-powered search (external)

```
┌─────────────────────────────────────────────────────────┐
│                    Next.js Frontend                       │
│  (React, TypeScript, TanStack Query, shadcn/ui)          │
└────────────┬────────────────────────────────────────────┘
             │
             │ HTTP/REST
             ▼
┌────────────────────────────────────────────────────────┐
│              Node.js/Express Backend                    │
│   • JWT Authentication                                  │
│   • Product Catalog                                     │
│   • Order Management                                    │
│   • User Management                                     │
│   • Review System                                       │
└─────┬──────────────────────────────────┬───────────────┘
      │                                  │
      │                                  │
      ▼                                  ▼
┌─────────────┐                  ┌──────────────────┐
│   MongoDB   │                  │  FastAPI Service │
│             │                  │  Vector Search   │
│  • Products │                  │  • Embeddings    │
│  • Users    │                  │  • Similarity    │
│  • Orders   │                  │  • Indexing      │
└─────────────┘                  └──────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB
- Python 3.8+ (for vector search service)
- npm or pnpm

### 1. Backend Setup

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Configure .env with your settings
# MONGODB_URL, JWT_SECRET, etc.

# Run development server
npm run dev
```

Backend runs on `http://localhost:3333`

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Configure .env.local
# NEXT_PUBLIC_API_URL=http://localhost:3333
# NEXT_PUBLIC_VECTORS_URL=http://localhost:8000 (if using vector search)

# Run development server
npm run dev
```

Frontend runs on `http://localhost:3000`

### 3. Vector Search Service (Optional)

The backend expects a FastAPI service for vector search. Set up according to your vector search backend or disable semantic search in frontend config.

## 📁 Project Structure

```
e-commerce-platform-backend/
├── src/                          # Backend source code
│   ├── controllers/              # Request handlers
│   ├── models/                   # MongoDB models
│   ├── routes/                   # API routes
│   ├── middlewares/              # Auth, validation
│   ├── utils/                    # Utilities
│   └── config/                   # Configuration
├── frontend/                     # Next.js frontend
│   ├── app/                      # App Router pages
│   ├── components/               # React components
│   ├── lib/                      # Core libraries
│   │   ├── api/                  # API services
│   │   ├── validations/          # Zod schemas
│   │   ├── http.ts               # HTTP client
│   │   ├── queryClient.ts        # TanStack Query
│   │   └── env.ts                # Environment validation
│   ├── tests/                    # Tests
│   ├── README.md                 # Frontend documentation
│   └── MIGRATION.md              # Extension guide
├── docker-compose.yml            # Docker configuration
├── package.json                  # Backend dependencies
└── README.md                     # This file
```

## 🔑 Key Features

### Backend Features

- ✅ **JWT Authentication** - Secure token-based auth with refresh tokens
- ✅ **Product Management** - Full CRUD with categories, images, inventory
- ✅ **Order Processing** - Cart, checkout, Razorpay payment integration
- ✅ **User Management** - Registration, profile, email verification
- ✅ **Review System** - Product reviews and ratings
- ✅ **Vector Search Integration** - Semantic search via FastAPI
- ✅ **Image Upload** - Azure Blob Storage integration
- ✅ **Email Notifications** - Mailgun integration
- ✅ **Automatic Embeddings** - Cron job for vector index updates

### Frontend Features

- ✅ **Modern UI** - shadcn/ui components with Tailwind CSS
- ✅ **AI-Powered Search** - Semantic vector search + regular search
- ✅ **Smart Caching** - TanStack Query for optimal performance
- ✅ **Type Safety** - Full TypeScript with Zod validation
- ✅ **Dark Mode** - System-aware theme switching
- ✅ **Responsive Design** - Mobile-first approach
- ✅ **Form Validation** - Client-side validation with helpful errors
- ✅ **Error Handling** - Consistent error UI across the app
- ✅ **Testing** - Vitest + Playwright for comprehensive testing

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: Zod
- **File Upload**: Multer + Azure Blob Storage
- **Email**: Mailgun
- **Payment**: Razorpay
- **Build**: SWC
- **Logging**: Morgan

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **UI Library**: React 19
- **Styling**: Tailwind CSS v4
- **Components**: shadcn/ui
- **State Management**: TanStack Query
- **Form Handling**: React Hook Form + Zod
- **HTTP Client**: Axios
- **Testing**: Vitest + Playwright
- **Code Quality**: ESLint + Prettier

## 📖 API Documentation

### Authentication Endpoints

```
POST   /api/auth/register          Register new user
POST   /api/auth/login             Login user
POST   /api/auth/logout            Logout user
POST   /api/auth/forgotpassword    Request password reset
POST   /resetpassword/:token       Reset password
GET    /api/auth/changepassword    Change password
GET    /confirm/:token             Confirm email
```

### Product Endpoints

```
GET    /api/product                List products (with filters)
GET    /api/product/:id            Get product details
GET    /api/product/category/:cat  Get products by category
POST   /api/product                Create product (admin)
PUT    /api/product/:id            Update product (admin)
DELETE /api/product/:id            Delete product (admin)
```

### Order Endpoints

```
GET    /api/order                  Get user orders
GET    /api/order/:id              Get order details
POST   /api/order                  Create order
PUT    /api/order/verify           Verify payment
PUT    /api/order                  Update order status
PUT    /api/order/cancel           Cancel order
```

### Search Endpoints

```
POST   /vsearch?vs=query           Vector semantic search
```

## 🔍 Semantic Search

The platform features AI-powered semantic search that understands natural language:

### How It Works

1. **Embedding Generation**: Product descriptions are converted to vector embeddings using ML models
2. **Vector Indexing**: Embeddings are stored in MongoDB with vector indexes
3. **Semantic Query**: User queries are converted to vectors and compared for similarity
4. **Relevance Ranking**: Results are ranked by cosine similarity scores

### Example Queries

- "comfortable running shoes for rainy weather"
- "affordable laptop for programming and design"
- "wireless headphones with good noise cancellation"

### Configuration

Enable/disable in frontend `.env.local`:

```env
NEXT_PUBLIC_ENABLE_SEMANTIC_SEARCH=true
```

## 🧪 Testing

### Backend Tests

```bash
npm run lint           # Run ESLint
npm run lint:fix       # Fix linting issues
```

### Frontend Tests

```bash
cd frontend

# Unit tests
npm run test           # Run Vitest
npm run test:ui        # Run with UI
npm run test:coverage  # Generate coverage

# E2E tests
npm run e2e            # Run Playwright tests
npm run e2e:ui         # Run with UI

# Code quality
npm run lint           # ESLint
npm run typecheck      # TypeScript check
npm run format         # Prettier format
```

## 🐳 Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up --build

# Backend runs on port 3001 (mapped from 3333)
# Nginx proxy on port 80
```

## 🔒 Security

- **JWT Tokens**: HttpOnly cookies for XSS protection
- **Password Hashing**: bcrypt with salt rounds
- **CORS**: Configured for frontend origin
- **Helmet**: Security headers
- **Input Validation**: Zod schemas on backend and frontend
- **SQL Injection**: Protected by Mongoose ORM
- **Rate Limiting**: Can be added with express-rate-limit

## 📝 Environment Variables

### Backend (.env)

```env
PORT=3333
NODE_ENV=development
HOST_URL=http://127.0.0.1:3333
MONGODB_URL=mongodb://localhost:27017/ecommerce_db
JWT_SECRET=your_jwt_secret
VECTORS_BACKEND_URL=http://localhost:8000

# JWT Keys
ACCESS_TOKEN_PRIVATE_KEY=your_private_key
ACCESS_TOKEN_PUBLIC_KEY=your_public_key
REFRESH_TOKEN_PRIVATE_KEY=your_refresh_private_key
REFRESH_TOKEN_PUBLIC_KEY=your_refresh_public_key

# Email (Mailgun)
MAILGUN_API_KEY=your_mailgun_key
MAILGUN_DOMAIN=your_domain
FROM_SUPPORT_EMAIL=support@example.com
FROM_SENDER_EMAIL=noreply@example.com
SUPPORT_EMAIL=support@example.com

# Azure Storage
AZURE_STORAGE_CONNECTION_STRING=your_connection_string
AZURE_STORAGE_ACCOUNT_NAME=your_account_name
AZURE_STORAGE_ACCOUNT_KEY=your_account_key
BLOB_CONTAINER_NAME=your_container

# Razorpay
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret

# Logo
LOGO_URL=your_logo_url
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:3333
NEXT_PUBLIC_VECTORS_URL=http://localhost:8000
NEXT_PUBLIC_ENABLE_SEMANTIC_SEARCH=true
NEXT_PUBLIC_ENABLE_CHAT_RECS=false
```

## 📚 Documentation

- **Frontend README**: `frontend/README.md` - Detailed frontend setup and API usage
- **Migration Guide**: `frontend/MIGRATION.md` - How to extend the platform with new features
- **API Tests**: See Postman collection (can be added)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style

- Backend: Follow ESLint configuration
- Frontend: Use Prettier for formatting
- TypeScript: Strict mode enabled
- Commits: Use conventional commits

## 📈 Roadmap

### Phase 1 (Current)
- [x] Backend API with MongoDB
- [x] JWT authentication
- [x] Product catalog
- [x] Order management
- [x] Vector search integration
- [x] Frontend foundation
- [x] Authentication pages
- [x] Search UI
- [x] Testing infrastructure

### Phase 2 (Next)
- [ ] Product detail pages with image gallery
- [ ] Shopping cart with local storage
- [ ] Checkout flow with Razorpay
- [ ] Order tracking and history
- [ ] User account management
- [ ] Wishlist feature

### Phase 3 (Future)
- [ ] Admin dashboard
- [ ] Analytics and reporting
- [ ] Product recommendations
- [ ] Advanced filtering and sorting
- [ ] Real-time notifications
- [ ] Mobile app (React Native)

## 🐛 Troubleshooting

### Backend Issues

**MongoDB Connection Failed**
- Check if MongoDB is running
- Verify MONGODB_URL in .env
- Ensure network access

**JWT Errors**
- Verify all JWT keys are set
- Check token expiration settings
- Clear cookies and re-login

### Frontend Issues

**Build Errors**
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check Node.js version (18+ required)

**API Connection Failed**
- Verify backend is running
- Check NEXT_PUBLIC_API_URL
- Check CORS configuration

**Tailwind Styles Not Working**
- Using Tailwind CSS v4 (beta) - may have compatibility issues
- Consider downgrading to v3 for production

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- Rahul Ranjan - [GitHub](https://github.com/rahulranjandev)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- shadcn for the beautiful UI components
- Vercel for hosting and development tools
- MongoDB for the flexible database
- TanStack for excellent React libraries

## 📞 Support

For support, email support@example.com or open an issue in the repository.

---

**Built with ❤️ using modern web technologies**
