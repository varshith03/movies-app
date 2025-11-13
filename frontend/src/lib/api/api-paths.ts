const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

export const API_PATHS = {
  MOVIES: {
    BASE: `${API_BASE_URL}/movies`,
    BY_ID: (id: string) => `${API_BASE_URL}/movies/${id}`,
  },
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
  },
} as const;
