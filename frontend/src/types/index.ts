export interface Movie {
  id: string;
  title: string;
  year: number;
  genre: string[];
  director: string;
  actors: string[];
  runtime: number;
  rating: number;
  plot: string;
  box_office: string;
  screenwriter: string;
  studio: string;
  poster_url: string;
  day: number;
  month: number;
}

export interface CastMember {
  id: number;
  name: string;
  profile_path?: string | null;
}

export interface MovieApiResponse {
  id: string;
  title: string;
  year: number;
  genre: string[];
  rating: number;
  runtime?: number;
  director?: string;
  actors?: string[];
  plot?: string;
  poster_url?: string;
  release_date?: string;
  vote_average?: number;
  box_office?: string;
  screenwriter?: string;
  studio?: string;
  day?: number;
  month?: number;
}

export interface JwtPayload {
  role?: string;
  [key: string]: unknown;
}
