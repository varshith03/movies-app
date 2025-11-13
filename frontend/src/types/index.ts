export interface Genre {
  id: number;
  name: string;
}

export interface MovieApiResponse {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
  genre_ids: number[];
}

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string; // can be relative path or full url
  backdrop_path: string;
  vote_average: number;
  release_date: string;
  runtime: number;
  genres: Genre[];
  budget?: number;
  revenue?: number;
  status?: string;
  director?: string;
  original_language?: string;
  studio?: string;
  screenwriter?: string;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string;
}
