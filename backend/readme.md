# Movies App Backend

A TypeScript + Express.js backend application with MongoDB for managing movies data.

## 🚀 Features

- **Authentication**: JWT-based authentication with predefined users
- **Movie Management**: CRUD operations for movies with search, sort, filter, and pagination
- **CSV Export**: Export movie data in CSV format
- **Security**: Helmet, CORS, and rate limiting
- **TypeScript**: Full TypeScript support with strict type checking

## 📋 Prerequisites

- Node.js >= 16.0.0
- npm >= 8.0.0
- MongoDB (local or Atlas)

## 🛠️ Installation

1. **Clone the repository** (if applicable)

   ```bash
   git clone <repository-url>
   cd movies-app/backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` file with your configuration:

   ```env
   PORT=8080
   MONGODB_URI=mongodb://localhost:27017/movies_db
   JWT_SECRET=your-secret-key
   ```

4. **Start MongoDB** (if running locally)

   ```bash
   # macOS with Homebrew
   brew services start mongodb/brew/mongodb-community

   # Or start manually
   mongod --config /opt/homebrew/etc/mongod.conf
   ```

## 🏃‍♂️ Running the Application

### Development Mode

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm start
```

### Other Scripts

```bash
npm run type-check    # TypeScript type checking
npm run build:watch   # Build with watch mode
npm run clean         # Clean build directory
```

## 🔐 Authentication

### Predefined Users

- **User**: `user` / `user123`
- **Admin**: `admin` / `admin123`

### Login

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "user", "password": "user123"}'
```

## 📚 API Endpoints

### Authentication

- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/profile` - Get user profile (protected)

### Movies

- `GET /api/movies` - Get movies with optional query parameters
- `GET /api/movies/:id` - Get specific movie by ID
- `GET /api/movies/export` - Export movies as CSV

### Health Check

- `GET /api/health` - API health status
- `GET /` - API information

## 🎬 Movie Data Structure

Each movie object includes the following fields:

| Field          | Type     | Required | Description             |
| -------------- | -------- | -------- | ----------------------- |
| `id`           | string   | ✅       | Unique movie identifier |
| `title`        | string   | ✅       | Movie title             |
| `year`         | number   | ✅       | Release year            |
| `day`          | number   | ❌       | Day of release (1-31)   |
| `month`        | number   | ❌       | Month of release (1-12) |
| `genre`        | string[] | ✅       | Array of genres         |
| `director`     | string   | ✅       | Director name           |
| `actors`       | string[] | ✅       | Array of actor names    |
| `runtime`      | number   | ✅       | Runtime in minutes      |
| `rating`       | number   | ✅       | Rating (0-10)           |
| `plot`         | string   | ✅       | Movie plot/description  |
| `box_office`   | string   | ❌       | Box office earnings     |
| `screenwriter` | string   | ❌       | Screenwriter name       |
| `studio`       | string   | ❌       | Production studio       |
| `poster`       | string   | ❌       | Poster filename         |
| `poster_url`   | string   | ❌       | Poster URL              |
| `releaseDate`  | Date     | ❌       | Full release date       |

## 🔍 Query Parameters

### GET /api/movies

| Parameter   | Type   | Description                           | Example                      |
| ----------- | ------ | ------------------------------------- | ---------------------------- |
| `search`    | string | Search in title, plot, director, cast | `?search=matrix`             |
| `sort`      | string | Sort by `rating` or `year`            | `?sort=rating`               |
| `sortOrder` | string | Sort order: `asc` or `desc`           | `?sortOrder=asc`             |
| `filter`    | string | Filter by genre (supports multiple)   | `?filter=genre:Sci-Fi,Drama` |
| `limit`     | number | Number of results (1-100)             | `?limit=10`                  |
| `offset`    | number | Skip number of results                | `?offset=20`                 |

### Examples

```bash
# Search for movies with "matrix" in title/plot/director/cast
GET /api/movies?search=matrix

# Get Sci-Fi movies sorted by rating (descending - default)
GET /api/movies?filter=genre:Sci-Fi&sort=rating

# Get Sci-Fi movies sorted by rating (ascending)
GET /api/movies?filter=genre:Sci-Fi&sort=rating&sortOrder=asc

# Get movies sorted by year (oldest first)
GET /api/movies?sort=year&sortOrder=asc

# Get movies that are either Drama or Adventure
GET /api/movies?filter=genre:Drama,Adventure

# Combined search with multiple genres (lowest rated first)
GET /api/movies?search=the&filter=genre:Drama,Adventure&sort=rating&sortOrder=asc

# Pagination: Get 5 movies starting from offset 10
GET /api/movies?limit=5&offset=10

# Combined query with ascending year sort
GET /api/movies?search=nolan&sort=year&sortOrder=asc&limit=5
```

## 🏗️ Project Structure

```
src/
├── config/
│   └── database.ts          # MongoDB connection
├── controllers/
│   ├── AuthController.ts    # Authentication logic
│   └── MovieController.ts   # Movie operations
├── middleware/
│   └── auth.ts              # JWT authentication middleware
├── models/
│   └── Movie.ts             # MongoDB movie schema
├── routes/
│   ├── auth.ts              # Authentication routes
│   ├── movies.ts            # Movie routes
│   └── index.ts             # Route aggregator
├── services/
│   ├── AuthService.ts       # Authentication business logic
│   └── MovieService.ts      # Movie business logic
├── types/
│   └── index.ts             # TypeScript interfaces
└── app.ts                   # Main application file
```

## 🧪 Testing

Currently, no tests are configured. You can add testing with Jest:

```bash
npm install --save-dev jest @types/jest ts-jest supertest @types/supertest
```

## 🚨 Error Handling

The API uses standard HTTP status codes:

- `200` - Success
- `400` - Bad Request (invalid parameters)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

All responses follow this format:

```json
{
  "success": boolean,
  "message": string,
  "data": object (optional),
  "pagination": object (optional for paginated responses)
}
```

## 🔧 Environment Variables

| Variable      | Description               | Default                               |
| ------------- | ------------------------- | ------------------------------------- |
| `PORT`        | Server port               | `8080`                                |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/movies_db` |
| `JWT_SECRET`  | JWT signing secret        | (required)                            |

## 📝 License

MIT License - see LICENSE file for details.
