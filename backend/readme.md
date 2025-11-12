# MovieFlix Dashboard Backend API

A production-ready Express.js REST API built with TypeScript, following clean architecture principles. This API provides movie search, caching, analytics, and authentication features with comprehensive documentation and testing.

## 🚀 Features

### Core Functionality
- **Movie Search & Discovery**: Search movies using OMDb or TMDB API with advanced filtering and sorting
- **Intelligent Caching**: MongoDB-based caching with automatic TTL expiration (24 hours)
- **Analytics Dashboard**: Genre distribution, average ratings, and runtime analytics
- **Data Export**: JSON and CSV export capabilities for movie data
- **JWT Authentication**: Secure token-based authentication with role-based access control

### API Endpoints

#### Movies
- `GET /api/movies?search={title}&sort={rating|year|title}&filter=genre:Sci-Fi&limit=20&page=1` - Search movies
- `GET /api/movies/:id` - Get movie details by ID
- `GET /api/movies/analytics` - Get movie analytics (authenticated)
- `GET /api/movies/export?format={json|csv}` - Export movies (admin only)

#### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/profile` - Get user profile (authenticated)
- `POST /api/auth/refresh` - Refresh JWT token (authenticated)

#### System
- `GET /health` - Basic health check
- `GET /api/health` - Detailed health status
- `GET /api/docs` - Swagger API documentation

## 🛠 Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js with TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with bcrypt password hashing
- **External APIs**: OMDb API / TMDB API integration
- **Logging**: Winston with structured logging
- **Validation**: Zod for environment and data validation
- **Testing**: Jest with Supertest
- **Documentation**: Swagger/OpenAPI 3.0
- **Code Quality**: ESLint, Prettier, Husky pre-commit hooks
- **Security**: Helmet, CORS, rate limiting

## 📋 Prerequisites

- Node.js 18+ and npm 9+
- MongoDB 4.4+ (local or cloud instance)
- OMDb API key (get from [OMDb API](http://www.omdbapi.com/apikey.aspx))
- TMDB API key (optional, get from [TMDB](https://developers.themoviedb.org/3))

## ⚡ Quick Start

### 1. Clone and Setup

```bash
git clone <repository-url>
cd movieflix-dashboard-backend
npm install
```

### 2. Environment Configuration

Copy the environment template:
```bash
cp .env.example .env
```

Update `.env` with your configuration:
```env
# Required Configuration
NODE_ENV=development
PORT=3001
OMDB_API_KEY=your_omdb_api_key_here
MONGODB_URI=mongodb://localhost:27017/movieflix-dashboard
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Admin User (for demo)
ADMIN_EMAIL=admin@movieflix.com
ADMIN_PASSWORD=admin123

# Optional Configuration
TMDB_API_KEY=your_tmdb_api_key_here
MOVIE_API_PROVIDER=omdb
CACHE_TTL_HOURS=24
RATE_LIMIT_MAX_REQUESTS=100
```

### 3. Start MongoDB

**Using Docker:**
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

**Or install locally:**
- macOS: `brew install mongodb-community`
- Ubuntu: Follow [MongoDB installation guide](https://docs.mongodb.com/manual/installation/)

### 4. Run the Application

**Development mode:**
```bash
npm run dev
```

**Production build:**
```bash
npm run build
npm start
```

### 5. Verify Installation

- API: http://localhost:3001
- Health Check: http://localhost:3001/health
- API Documentation: http://localhost:3001/api/docs

## 🏗 Architecture Overview

The application follows **Clean Architecture** principles:

```
src/
├── app.ts                 # Express app configuration
├── server.ts              # Server bootstrap and lifecycle
├── config/                # Configuration management
│   ├── env.ts            # Environment validation with Zod
│   ├── database.ts       # MongoDB connection management  
│   └── logger.ts         # Winston logging configuration
├── controllers/           # HTTP request handlers
│   ├── MovieController.ts
│   └── AuthController.ts
├── routes/               # API route definitions
│   ├── movies.ts
│   ├── auth.ts
│   └── index.ts
├── services/             # Business logic layer
│   ├── MovieService.ts       # Movie caching and search logic
│   ├── ExternalMovieService.ts # OMDb/TMDB API integration
│   └── AuthService.ts        # Authentication and user management
├── models/               # Database schemas
│   ├── Movie.ts          # Movie cache schema
│   └── User.ts           # User authentication schema
├── middleware/           # Express middleware
│   ├── auth.ts           # JWT authentication
│   ├── errorHandler.ts   # Global error handling
│   ├── rateLimiter.ts    # API rate limiting
│   └── logging.ts        # Request/response logging
├── types/                # TypeScript interfaces
├── utils/                # Utility functions
├── tests/                # Jest test suites
└── docs/                 # API documentation
```

## 🔐 Authentication & Authorization

### JWT Authentication Flow

1. **User Registration**: `POST /api/auth/register`
2. **Login**: `POST /api/auth/login` → Returns JWT token
3. **Protected Routes**: Include `Authorization: Bearer <token>` header
4. **Admin Routes**: Require admin role (movies export, etc.)

### Default Admin User
- Email: `admin@movieflix.com` 
- Password: `admin123`
- Role: `admin`

**⚠️ Change default credentials in production!**

## 🧪 Testing

### Test Structure
```
src/tests/
├── setup.ts              # Jest configuration and MongoDB memory server
├── auth.test.ts           # Authentication endpoint tests
├── movies.test.ts         # Movie endpoint tests
└── health.test.ts         # Health check tests
```

### Running Tests
```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

### Test Coverage Targets
- **Statements**: 80%+
- **Branches**: 80%+
- **Functions**: 80%+
- **Lines**: 80%+

---

**Built with ❤️ for the MovieFlix Dashboard project**