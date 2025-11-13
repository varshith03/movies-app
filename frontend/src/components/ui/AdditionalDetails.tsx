import type { Movie } from "@/types";
import { formatMoney } from "@/lib/format";

export default function AdditionalDetails({ movie }: { movie: Movie }) {
  return (
    <section className="container mx-auto px-4 mt-16 pb-20 text-gray-300">
      <h3 className="text-2xl font-extrabold text-white mb-8">
        Additional Information
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="text-sm">Director</div>
          <div className="font-semibold text-white mt-2">{movie.director}</div>
          <div className="text-sm mt-6">Box Office</div>
          <div className="font-semibold text-white mt-2">
            {formatMoney(movie.revenue)}
          </div>
        </div>
        <div>
          <div className="text-sm">Original Language</div>
          <div className="font-semibold text-white mt-2">
            {movie.original_language}
          </div>
          <div className="text-sm mt-6">Studio</div>
          <div className="font-semibold text-white mt-2">{movie.studio}</div>
        </div>
        <div>
          <div className="text-sm">Release Date</div>
          <div className="font-semibold text-white mt-2">
            {new Date(movie.release_date).toLocaleDateString()}
          </div>
          <div className="text-sm mt-6">Screenwriter</div>
          <div className="font-semibold text-white mt-2">
            {movie.screenwriter}
          </div>
        </div>
      </div>
    </section>
  );
}
