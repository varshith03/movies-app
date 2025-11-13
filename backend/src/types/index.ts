import { Document } from "mongoose";

export interface IMovie extends Document {
  _id: string;
  id: string; // String ID for API response
  title: string;
  year: number;
  day?: number; // Day of release (1-31)
  month?: number; // Month of release (1-12)
  genre: string[];
  director: string;
  actors: string[]; // Changed from 'cast' to 'actors'
  runtime: number; // in minutes
  rating: number;
  plot: string;
  box_office?: string; // New field
  screenwriter?: string; // New field
  studio?: string; // New field
  poster?: string;
  poster_url?: string; // New field for poster URL
  releaseDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUser {
  username: string;
  password: string;
  role: "user" | "admin";
}

export interface IAuthToken {
  username: string;
  role: "user" | "admin";
}

export interface IPaginationQuery {
  limit?: number;
  offset?: number;
}

export interface IMovieQuery extends IPaginationQuery {
  search?: string;
  sort?: "rating" | "year";
  sortOrder?: "asc" | "desc"; // Sort order: ascending or descending (default: desc)
  filter?: string; // Format: "genre:Sci-Fi" or "genre:Drama,Adventure"
}

export interface IPaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
