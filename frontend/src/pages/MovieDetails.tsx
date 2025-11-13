import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import MovieDetailsMain from "../components/ui/MovieDetailsMain";
import CrewDetails from "../components/ui/CrewDetails";
import AdditionalDetails from "../components/ui/AdditionalDetails";

import type { Movie, CastMember } from "../types";
import { MOCK_MOVIE } from "../data/mock";

// Since we're using direct URLs from the mock data, we don't need buildImageUrl anymore

export default function MovieDetailsPage() {
  const { id } = useParams<{ id?: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [cast, setCast] = useState<CastMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setMovie(MOCK_MOVIE);

      // Transform actors array to match CastMember type
      const actorsAsCast: CastMember[] = MOCK_MOVIE.actors.map(
        (name, index) => ({
          id: index + 1, // Generate a simple ID since we don't have actor IDs
          name,
          profile_path: null, // Always null as per requirements
        })
      );

      setCast(actorsAsCast);
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
      <div className="min-h-screen flex items-center justify-center bg-background/95">
        <div className="text-center py-10 text-foreground/80">
          Movie not found
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background/95">
      <div className="w-full max-w-[1400px] mx-auto px-32 py-8">
        <div className="mb-6">
          <Link
            to=".."
            className="text-foreground/80 hover:text-primary hover:bg-primary/5 px-2 py-1 rounded-md -ml-2 inline-flex items-center gap-2 transition-colors"
          >
            <div className="inline-flex items-center group">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/5 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200 -ml-2">
                <ArrowLeft className="h-3.5 w-3.5 group-hover:text-primary-foreground" />
              </div>
              <span className="ml-1">Back to Movies</span>
            </div>
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
