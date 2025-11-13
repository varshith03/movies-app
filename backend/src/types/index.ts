import { Document } from "mongoose";

export interface IMovie extends Document {
  _id: string;
  id: string;
  title: string;
  year: number;
  day?: number;
  month?: number;
  genre: string[];
  director: string;
  actors: string[];
  runtime: number;
  rating: number;
  plot: string;
  box_office?: string;
  screenwriter?: string;
  studio?: string;
  poster?: string;
  poster_url?: string;
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
  sortOrder?: "asc" | "desc";
  filter?: string;
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
