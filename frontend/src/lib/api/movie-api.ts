// src/lib/api/movie-api.ts
import { API_PATHS } from "./api-paths";
import type { Movie } from "@/types";
import apiClient from "./api-client";

export const movieApi = {
  fetchMovies: async (): Promise<Movie[]> => {
    const { data } = await apiClient.get(API_PATHS.MOVIES.BASE);
    return data;
  },

  fetchMovieById: async (id: string): Promise<Movie> => {
    const { data } = await apiClient.get(API_PATHS.MOVIES.BY_ID(id));
    return data;
  },
};
