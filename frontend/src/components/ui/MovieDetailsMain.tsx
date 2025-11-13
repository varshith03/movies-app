import { Star, Play } from "lucide-react";

export default function MovieDetailsMain() {
  // Hardcoded movie data
  const movie = {
    title: "The Shawshank Redemption",
    backdrop_path: "https://image.tmdb.org/t/p/original/9cqNxx0GxF0bflZmeSMuL5tnWzU.jpg",
    poster_path: "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
    release_date: "1994-09-23",
    runtime: 142,
    vote_average: 8.7,
    genres: ["Drama", "Crime"],
    overview: "Framed in the 1940s for the double murder of his wife and her lover, upstanding banker Andy Dufresne begins a new life at the Shawshank prison, where he puts his accounting skills to work for an amoral warden. During his long stretch in prison, Dufresne comes to be admired by the other inmates -- including an older prisoner named Red -- for his integrity and unquenchable sense of hope.",
  };

  // Format release year
  const releaseYear = new Date(movie.release_date).getFullYear();
  
  // Format runtime
  const hours = Math.floor(movie.runtime / 60);
  const minutes = movie.runtime % 60;
  const formattedRuntime = `${hours}h ${minutes}m`;

  return (
    <section className="relative bg-gray-900">
      {/* Backdrop Image with Gradient Overlay */}
      <div
        className="h-[50vh] bg-cover bg-center"
        style={{
        //   backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 100%), url(${movie.backdrop_path})`,
        }}
      />

      {/* Movie Content */}
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 -mt-40 relative z-10">
        <div className="flex flex-col items-center md:items-start md:flex-row gap-8">
          {/* Movie Poster */}
          <div className="w-full md:w-1/3 lg:w-1/4">
            <img
              className="w-full rounded-lg shadow-2xl"
              src={movie.poster_path}
              alt={movie.title}
            />
          </div>

          {/* Movie Info */}
          <div className="text-white flex-1 w-full max-w-4xl">
            <h1 className="text-5xl font-bold mb-2">{movie.title}</h1>
            <div className="flex items-center gap-4 text-gray-300 mb-6">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 text-yellow-400" />
                <span className="font-semibold">
                  {movie.vote_average.toFixed(1)}
                </span>
              </div>
              <span>{releaseYear}</span>
              <span>•</span>
              <span>{formattedRuntime}</span>
            </div>

            {/* Genres */}
            <div className="flex gap-2 mb-6">
              {movie.genres.map((genre, index) => (
                <span
                  key={index}
                  className="bg-gray-700 px-3 py-1 rounded-full text-sm"
                >
                  {genre}
                </span>
              ))}
            </div>

            {/* Overview */}
            <div className="mb-8 max-w-2xl mx-auto md:mx-0">
              <p className="text-gray-300 leading-relaxed text-lg">
                {movie.overview}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-8">
              <button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full font-medium text-lg transition-colors shadow-lg">
                <Play className="w-5 h-5" />
                <span>Watch Now</span>
              </button>
              <button className="flex items-center gap-2 bg-transparent border-2 border-gray-400 hover:bg-gray-800 text-white px-8 py-3 rounded-full font-medium text-lg transition-colors">
                <Play className="w-5 h-5" />
                <span>Watch Trailer</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}