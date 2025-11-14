import type { Movie } from "@/types";

const getMonthName = (month: number): string => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return months[month - 1] || "";
};

export default function AdditionalDetails({ movie }: { movie: Movie }) {
  return (
    <section className="container mx-auto px-4 py-8 bg-background/95">
      <h3 className="text-2xl font-extrabold text-foreground mb-8">
        Additional Information
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="text-sm text-muted-foreground">Director</div>
          <div className="font-semibold text-foreground mt-2">
            {movie.director}
          </div>
          <div className="text-sm mt-6">Box Office</div>
          <div className="font-semibold text-foreground mt-2">
            {movie.box_office}
          </div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Released On</div>
          <div className="font-semibold text-foreground mt-2">
            {movie.day} {getMonthName(movie.month)} {movie.year}
          </div>
          <div className="text-sm mt-6">Studio</div>
          <div className="font-semibold text-foreground mt-2">
            {movie.studio}
          </div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Runtime</div>
          <div className="font-semibold text-foreground mt-2">
            {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
          </div>
          <div className="text-sm mt-6">Screenwriter</div>
          <div className="font-semibold text-foreground mt-2">
            {movie.screenwriter}
          </div>
        </div>
      </div>
    </section>
  );
}
