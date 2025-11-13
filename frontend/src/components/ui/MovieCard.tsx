import React from "react";
import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface MovieCardProps {
  id?: number | string;
  title: string;
  posterPath?: string | null;
  rating: number;
  releaseDate?: string;
  genreIds?: number[];
  className?: string;
}

const getGenreNames = (ids: number[] = []): string => {
  const genreMap: Record<number, string> = {
    28: "Action",
    12: "Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    18: "Drama",
    10751: "Family",
    14: "Fantasy",
    36: "History",
    27: "Horror",
    10402: "Music",
    9648: "Mystery",
    10749: "Romance",
    878: "Sci-Fi",
    10770: "TV Movie",
    53: "Thriller",
    10752: "War",
    37: "Western",
  };

  return ids
    .slice(0, 2)
    .map((id) => genreMap[id] || "")
    .filter(Boolean)
    .join(", ");
};

export default function MovieCard({
  title,
  posterPath,
  rating,
  releaseDate,
  genreIds = [],
  className,
}: MovieCardProps) {
  const year = releaseDate ? new Date(releaseDate).getFullYear() : "";
  const genres = getGenreNames(genreIds);

  return (
    // outer padded container to match the white space around the card in your example
    <div className={cn("p-4", className)}>
      <Card className="group overflow-visible rounded-2xl shadow-md p-0">
        {/* image area with white frame / inset */}
        <div className="py-8 px-4">
          {" "}
          {/* space between card edge and framed poster */}
          <div className="rounded-xl bg-white shadow-inner">
            <div className="relative overflow-hidden rounded-md aspect-[2/3] bg-slate-800">
              <img
                className="w-full h-full object-cover rounded-sm"
                src={
                  posterPath ||
                  "https://www.shutterstock.com/image-vector/online-cinema-banner-web-films-260nw-1297012507.jpg"
                }
                alt={title}
              />
            </div>
          </div>
        </div>

        {/* separate footer section BELOW the card content (not inside CardContent) to match your mock */}
      </Card>

      {/* details block below card (separate section) */}
      <div className="mt-3 flex items-start justify-between gap-3">
        <div className="flex-1">
          <h3 className="text-sm font-semibold line-clamp-2">{title}</h3>
          <div className="mt-1 text-xs text-muted-foreground">
            {year}
            {genres && ` • ${genres}`}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-yellow-50 text-yellow-700 text-xs font-medium px-2 py-1 rounded">
            <Star className="w-3 h-3 mr-1" />
            {rating.toFixed(1)}
          </div>
        </div>
      </div>
    </div>
  );
}
