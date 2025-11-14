import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import MovieDetailsMain from "../components/ui/movie-details-main";
import CrewDetails from "../components/ui/crew-details";
import AdditionalDetails from "../components/ui/additional-details";

import type { CastMember } from "../types";
import { movieApi } from "../lib/api/api-calls";
import ReturnHome from "@/components/ui/return-home";

export default function MovieDetailsPage() {
  const { id } = useParams<{ id: string }>();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const {
    data: movie,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["movie", id],
    queryFn: () => movieApi.fetchMovieById(id!),
    select: (movieData) => {
      const actorsAsCast: CastMember[] = movieData.actors.map(
        (name: string, index: number) => ({
          id: index + 1,
          name,
          profile_path: null,
        })
      );

      return { ...movieData, cast: actorsAsCast };
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0e0b14]">
        <div className="text-gray-300">Loading movie details...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0e0b14]">
        <div className="text-red-400">
          Error loading movie details. Please try again.
        </div>
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

  const { cast = [], ...movieData } = movie;

  return (
    <div className="min-h-screen bg-background/95">
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <ReturnHome />
        </div>

        <MovieDetailsMain movie={movieData} />

        <CrewDetails cast={cast} />
        <AdditionalDetails movie={movieData} />
      </div>
    </div>
  );
}
