import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import MovieDetailsMain from "../components/ui/MovieDetailsMain";
import CrewDetails from "../components/ui/CrewDetails";
import AdditionalDetails from "../components/ui/AdditionalDetails";

import type { Movie, CastMember } from "../types";
import { MOCK_MOVIE, MOCK_CAST } from "../data/mock";

/**
 * Helper: build TMDB image URL when the value is a path (starts with '/').
 * If the mock or API already provides a full URL, it will be returned as-is.
 */
const buildImageUrl = (path?: string, size: "w500" | "original" = "w500") => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

export default function MovieDetailsPage() {
  const { id } = useParams<{ id?: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [cast, setCast] = useState<CastMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // replace with real fetch; kept mock for immediate layout
    setLoading(true);
    setTimeout(() => {
      // map mock paths to full image urls (so child components can use them directly)
      const mappedMovie = {
        ...MOCK_MOVIE,
        poster_path: buildImageUrl(MOCK_MOVIE.poster_path, "w500"),
        backdrop_path: buildImageUrl(MOCK_MOVIE.backdrop_path, "original"),
      };
      const mappedCast = MOCK_CAST.map((c) => ({
        ...c,
        // cast profile could be local or a tmdb path; try to build
        profile_path: buildImageUrl(c.profile_path, "w500"),
      }));

      setMovie(mappedMovie);
      setCast(mappedCast);
      setLoading(false);
    }, 200);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0e0b14]">
        <div className="text-gray-300">Loading...</div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0e0b14]">
        <div className="text-center py-10 text-gray-300">Movie not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0e0b14]">
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link
            to=".."
            className="text-gray-300 hover:text-white inline-flex items-center gap-2 transition-colors"
          >
            ← Back to Movies
          </Link>
        </div>

        {/* Movie main hero (backdrop + poster + meta + actions)
            We pass the already-mapped full urls so the component can render exactly like original. */}
        <MovieDetailsMain movie={movie} />

        {/* Cast & crew */}
        <CrewDetails cast={cast} />

        {/* Additional info: director, box office, language, release date, etc. */}
        <AdditionalDetails movie={movie} />
      </div>
    </div>
  );
}
