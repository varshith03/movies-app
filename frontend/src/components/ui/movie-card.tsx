import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface MovieCardProps {
  id?: number | string;
  title: string;
  posterPath?: string | null;
  rating: number;
  releaseYear?: number;
  genres?: string[];
  className?: string;
}

export default function MovieCard({
  title,
  posterPath,
  rating,
  releaseYear,
  genres = [],
  className,
}: MovieCardProps) {

  return (
    <div className={cn("p-4", className)}>
      <Card className="group overflow-visible rounded-2xl shadow-md p-0">
        <div className="py-5 px-4">
          {" "}
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

      </Card>

      <div className="mt-3 flex items-start justify-between gap-3">
        <div className="flex-1">
          <h3 className="text-sm font-semibold line-clamp-2">{title}</h3>
          <div className="mt-1 text-xs text-muted-foreground">
            {releaseYear}
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
