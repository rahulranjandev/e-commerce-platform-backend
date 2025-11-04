# Quick Start Guide

Get the e-commerce platform running in 5 minutes!

## Prerequisites Check

```bash
# Check Node.js version (need 18+)
node --version

# Check npm
npm --version

# Check if MongoDB is running
mongosh --eval "db.version()"
```

## Step 1: Clone and Setup Backend

```bash
# Navigate to project root
cd e-commerce-platform-backend

# Install backend dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your settings (minimum required):
# - MONGODB_URL (default: mongodb://localhost:27017/ecommerce_db)
# - JWT_SECRET (any secure string)
# - VECTORS_BACKEND_URL (http://localhost:8000 or comment out if not using)

# For quick start, you can use these minimal settings:
echo 'PORT=3333
NODE_ENV=development  
HOST_URL="http://127.0.0.1:3333"
MONGODB_URL="mongodb://localhost:27017/ecommerce_db"
JWT_SECRET="dev_secret_change_in_production"
VECTORS_BACKEND_URL="http://localhost:8000"
ACCESS_TOKEN_PRIVATE_KEY="dev_key"
ACCESS_TOKEN_PUBLIC_KEY="dev_key"
REFRESH_TOKEN_PRIVATE_KEY="dev_key"
REFRESH_TOKEN_PUBLIC_KEY="dev_key"' > .env

# Start backend
npm run dev
```

Backend will start on `http://localhost:3333`

## Step 2: Setup Frontend

```bash
# Open new terminal
cd e-commerce-platform-backend/frontend

# Install frontend dependencies
npm install

# Copy environment file
cp .env.example .env.local

# The default values should work:
# NEXT_PUBLIC_API_URL=http://localhost:3333
# NEXT_PUBLIC_VECTORS_URL=http://localhost:8000
# NEXT_PUBLIC_ENABLE_SEMANTIC_SEARCH=true

# Start frontend
npm run dev
```

Frontend will start on `http://localhost:3000`

## Step 3: Test the Application

1. Open browser: `http://localhost:3000`
2. You should see the homepage
3. Click "Sign Up" to create an account
4. After registration, login with your credentials
5. Try the search feature

## Step 4: Seed Sample Data (Optional)

```bash
# In backend terminal
npm run seed
```

This will populate your database with sample products.

## Step 5: Verify Everything Works

### Test Backend API

```bash
# Health check
curl http://localhost:3333/health

# Should return: {"status":"success","message":"Server is Healthy 🚀"}
```

### Test Frontend

1. **Home Page** - `http://localhost:3000` - Should show hero section
2. **Register** - `http://localhost:3000/register` - Create account
3. **Login** - `http://localhost:3000/login` - Sign in
4. **Search** - `http://localhost:3000/search` - Search products

## Troubleshooting

### Backend won't start

**Problem**: `Error: MONGODB_URL is missing`
**Solution**: Make sure .env file exists with MONGODB_URL

**Problem**: MongoDB connection failed
**Solution**: 
```bash
# Start MongoDB
mongod --dbpath /path/to/data
# or with brew
brew services start mongodb-community
```

### Frontend won't start

**Problem**: Build errors
**Solution**:
```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run dev
```

**Problem**: Can't connect to backend
**Solution**: Verify backend is running on port 3333

### Can't login or register

**Problem**: CORS errors
**Solution**: Backend .env should have:
```
HOST_URL="http://127.0.0.1:3333"
```

And backend needs CORS configured for `http://localhost:3000`

## Next Steps

1. ✅ Platform is running!
2. 📖 Read `frontend/README.md` for detailed frontend docs
3. 🔧 Read `frontend/MIGRATION.md` to extend the platform
4. 🧪 Run tests: `cd frontend && npm test`
5. 🚀 Deploy to production

## Quick Commands Reference

```bash
# Backend
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Lint code
npm run seed         # Seed database

# Frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run test         # Run unit tests
npm run e2e          # Run E2E tests
npm run lint         # Lint code
npm run typecheck    # Check TypeScript
```

## Production Deployment

For production deployment:

1. Set proper environment variables (strong secrets, production URLs)
2. Set NODE_ENV=production
3. Use reverse proxy (nginx) for backend
4. Use a process manager (pm2) for Node.js
5. Set up MongoDB with authentication
6. Configure SSL certificates
7. Set up monitoring and logging

See `FULLSTACK_README.md` for complete documentation.

## Need Help?

- 📖 Documentation: `FULLSTACK_README.md`
- 🐛 Issues: [GitHub Issues](https://github.com/rahulranjandev/e-commerce-platform-backend/issues)
- 💬 Questions: Open a discussion on GitHub

Happy coding! 🎉
