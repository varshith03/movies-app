// src/lib/api/movie-api.ts
import { API_PATHS } from "./api-paths";
import type { Movie } from "@/types";
import apiClient from "./api-client";
import { parseJwt } from "@/lib/utils";

interface LoginResponse {
  success?: boolean;
  message: string;
  data: {
    token: string;
  };
}

export const authApi = {
  login: async (username: string, password: string): Promise<LoginResponse> => {
    const response = await apiClient.post(API_PATHS.AUTH.LOGIN, {
      username,
      password,
    });
    if (response.data?.data?.token) {
      localStorage.setItem("authToken", response.data.data.token);
    }
    return response.data;
  },

  getToken: (): string | null => {
    return localStorage.getItem("authToken");
  },

  isLoggedIn: (): boolean => {
    return !!localStorage.getItem("authToken");
  },

  isAdmin: (): boolean => {
    const token = localStorage.getItem("authToken");
    if (!token) return false;

    const decoded = parseJwt(token);
    return decoded?.role === "admin";
  },

  logout: (): void => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
  },
};

export const movieApi = {
  fetchMovies: async (
    params: {
      search?: string;
      filter?: string;
      sort?: string;
      sortOrder?: "asc" | "desc";
      limit?: number;
      offset?: number;
    } = {}
  ): Promise<{
    data: Movie[];
    pagination: { offset: number; limit: number; total: number };
  }> => {
    const { data } = await apiClient.get(API_PATHS.MOVIES.BASE, {
      params: {
        ...params,
        limit: params.limit || 10,
        offset: params.offset || 0,
      },
    });

    return data;
  },

  fetchMovieById: async (id: string): Promise<Movie> => {
    const { data } = await apiClient.get<{ data: Movie }>(
      API_PATHS.MOVIES.BY_ID(id)
    );
    return data.data;
  },

  exportMovies: async (): Promise<Blob> => {
    const response = await apiClient.get(API_PATHS.MOVIES.EXPORT, {
      responseType: "blob",
    });
    return response.data as Blob;
  },
};
