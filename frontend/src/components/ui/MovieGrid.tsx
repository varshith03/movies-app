import { Link } from "react-router-dom";
import MovieCard from "./MovieCard";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
  genre_ids: number[];
}

interface MovieGridProps {
  movies: Movie[];
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
            posterPath={movie.poster_path}
            rating={movie.vote_average}
            releaseDate={movie.release_date}
            genreIds={movie.genre_ids}
          />
        </Link>
      ))}
    </div>
  );
}
