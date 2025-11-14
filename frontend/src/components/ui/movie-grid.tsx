import { Link } from "react-router-dom";
import MovieCard from "./movie-card";
import type { MovieApiResponse } from "@/types";

interface MovieGridProps {
  movies: MovieApiResponse[];
  className?: string;
}

export function MovieGrid({ movies, className = "" }: MovieGridProps) {
  if (movies.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No movies found</p>
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 ${className}`}
    >
      {movies.map((movie) => (
        <Link to={`/movie/${movie.id}`} key={movie.id} className="block h-full">
          <MovieCard
            title={movie.title}
            posterPath={movie.poster_url}
            rating={movie.rating}
            releaseYear={movie.year}
            genres={movie.genre}
          />
        </Link>
      ))}
    </div>
  );
}
