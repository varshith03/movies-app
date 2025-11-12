export interface Movie {
  id: string;
  title: string;
  year: number;
  genre: string[];
  director: string;
  actors: string[];
  rating: number;
  runtime: number;
  plot: string;
}

export interface MovieSearchQuery {
  search?: string;
  sort?: 'rating' | 'year' | 'title';
  filter?: string; // e.g., "genre:Sci-Fi"
  limit?: number;
  offset?: number;
  page?: number;
}

export interface MovieAnalytics {
  genreDistribution: Record<string, number>;
  averageRating: number;
  averageRuntimeByYear: Record<string, number>;
  totalMovies: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: PaginationMeta;
}

export interface ErrorResponse {
  success: false;
  error: {
    message: string;
    code: string;
    statusCode: number;
    details?: unknown;
  };
}

export interface User {
  id: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  createdAt: Date;
  updatedAt: Date;
}

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: Omit<User, 'password'>;
}

// External API Types
export interface OmdbMovieResponse {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
  Genre?: string;
  Director?: string;
  Actors?: string;
  Plot?: string;
  Runtime?: string;
  imdbRating?: string;
  Response: string;
  Error?: string;
}

export interface OmdbSearchResponse {
  Search?: OmdbMovieResponse[];
  totalResults?: string;
  Response: string;
  Error?: string;
}

export interface CacheEntry<T> {
  data: T;
  createdAt: Date;
  expiresAt: Date;
}
