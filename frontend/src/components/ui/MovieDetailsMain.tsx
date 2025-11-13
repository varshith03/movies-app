import { Star, Play, Film } from "lucide-react";
import type { Movie } from "../../types";

interface MovieDetailsMainProps {
  movie: Movie;
}

export default function MovieDetailsMain({ movie }: MovieDetailsMainProps) {
  // Format release year from the year field
  const releaseYear = movie.year;

  // Format runtime
  const hours = Math.floor(movie.runtime / 60);
  const minutes = movie.runtime % 60;
  const formattedRuntime = `${hours}h ${minutes}m`;

  return (
    <div className="bg-background/95 pb-8 rounded-md shadow-lg">
      {/* Backdrop Image */}
      <div
        className="w-full bg-cover bg-center bg-primary-foreground min-h-[200px] rounded-md"
        style={
          {
            //   backgroundImage: `url(${movie.poster_url})`,
            //   backgroundImage:
            //     "linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 1))",
          }
        }
      />

      {/* Movie Content */}
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 -mt-40 relative z-10">
        <div className="flex flex-col items-center md:items-start md:flex-row gap-8">
          {/* Movie Poster */}
          <div className="w-full md:w-1/3 lg:w-1/4">
            <img
              className="w-full rounded-lg shadow-2xl"
              src={movie.poster_url}
              alt={movie.title}
            />
          </div>

          {/* Movie Info */}
          <div className="text-foreground flex-1 w-full max-w-4xl">
            <h1 className="text-5xl font-bold mb-2">{movie.title}</h1>
            <div className="flex items-center gap-4 text-muted-foreground mb-6">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="font-semibold">{movie.rating.toFixed(1)}</span>
              </div>
              <span>{releaseYear}</span>
              <span>•</span>
              <span>{formattedRuntime}</span>
            </div>

            {/* Genres */}
            <div className="flex gap-2 mb-6">
              {movie.genre.map((g, index) => (
                <span
                  key={index}
                  className="bg-accent px-3 py-1 rounded-full text-sm text-foreground"
                >
                  {g}
                </span>
              ))}
            </div>

            {/* Plot */}
            <div className="mb-8 max-w-2xl mx-auto md:mx-0 mt-16">
              <p className="text-foreground/80 leading-relaxed text-lg">
                {movie.plot}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-8">
              <button
                onClick={() =>
                  window.open(
                    `https://www.youtube.com/results?search_query=${encodeURIComponent(
                      movie.title
                    )}+full+movie`,
                    "_blank"
                  )
                }
                className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-full font-medium text-lg transition-colors shadow-lg cursor-pointer"
              >
                <Play className="w-5 h-5" />
                <span>Watch Now</span>
              </button>
              <button
                onClick={() =>
                  window.open(
                    `https://www.youtube.com/results?search_query=${encodeURIComponent(
                      movie.title
                    )}+trailer`,
                    "_blank"
                  )
                }
                className="flex items-center gap-2 bg-transparent border-2 border-border hover:bg-accent/30 text-foreground px-8 py-3 rounded-full font-medium text-lg transition-colors cursor-pointer"
              >
                <Film className="w-5 h-5" />
                <span>Watch Trailer</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
