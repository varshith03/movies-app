const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

export const API_PATHS = {
  MOVIES: {
    BASE: `${API_BASE_URL}/movies`,
    BY_ID: (id: string) => `${API_BASE_URL}/movies/${id}`,
    EXPORT: `${API_BASE_URL}/movies/export`,
  },
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
  },
} as const;
