import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  CustomDropdownCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { MovieGrid } from "@/components/ui/MovieGrid";
import type { MovieApiResponse } from "@/types";
import { allMovies } from "@/data/mock";

// Get unique genres from the movies data
const getUniqueGenres = (movies: MovieApiResponse[]): Set<string> => {
  const allGenres = new Set<string>();
  movies.forEach((movie) => {
    movie.genre?.forEach((genre) => allGenres.add(genre));
  });
  return allGenres;
};

// Sort options as a Set
const SORT_OPTIONS = new Set(["Rating", "Release Date"]);

export function AllMovies() {
  const [loading, setLoading] = useState(true);
  const [searchTerm] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState("popularity");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Remove unused query for now
  // const {
  //   data: moviess = [],
  // } = useQuery<MovieApiResponse[], Error>({
  //   queryFn: movieApi.fetchMovies,
  //   staleTime: 5 * 60 * 1000,
  // });

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        // Replace with your actual API call
        // const response = await fetch('YOUR_API_ENDPOINT');
        // const data = await response.json();
        // setMovies(data.results);
        // setMovies(allMovies);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // Log filter changes
  useEffect(() => {
    console.log("Selected genres:", selectedGenres);
    console.log("Sort by:", sortBy);
    console.log("Sort order:", sortOrder);
  }, [selectedGenres, sortBy, sortOrder]);

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(genre)) {
        newSet.delete(genre);
      } else {
        newSet.add(genre);
      }
      return newSet;
    });
  };

  const isGenreSelected = (genre: string) => selectedGenres.has(genre);
  console.log(selectedGenres);

  const filteredMovies = allMovies
    .filter((movie) => {
      if (selectedGenres.size === 0) return true;
      return Array.from(selectedGenres).some((genre) =>
        movie.genre?.includes(genre)
      );
    })
    .filter((movie) =>
      movie.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let compareResult = 0;

      if (sortBy === "title") {
        compareResult = a.title.localeCompare(b.title);
      } else if (sortBy === "release_date") {
        const dateA = a.release_date ? new Date(a.release_date).getTime() : 0;
        const dateB = b.release_date ? new Date(b.release_date).getTime() : 0;
        compareResult = dateA - dateB;
      } else {
        // @ts-ignore
        compareResult = (a[sortBy] || 0) - (b[sortBy] || 0);
      }

      return sortOrder === "asc" ? compareResult : -compareResult;
    });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
  }

  return (
    <div className="mx-auto px-32 py-8 bg-background/95">
      <div className="flex flex-col space-y-4 mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            All Movies
          </h1>

          <div className="flex flex-wrap items-center gap-3">
            {/* Genre Filter */}
            <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm rounded-md border border-border p-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1.5 text-sm font-medium text-foreground hover:bg-accent cursor-pointer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <path d="M3 6h18" />
                      <path d="M6 12h12" />
                      <path d="M9 18h6" />
                    </svg>
                    <span>Genres</span>
                    {selectedGenres.size > 0 && (
                      <span className="bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs">
                        {selectedGenres.size}
                      </span>
                    )}
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 max-h-96 overflow-y-auto bg-popover/95 backdrop-blur-sm border border-border shadow-lg"
                  align="end"
                >
                  <DropdownMenuLabel className="font-semibold text-popover-foreground">
                    Filter by Genre
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-border" />
                  <div className="max-h-64 overflow-y-auto p-1">
                    {Array.from(getUniqueGenres(allMovies)).map((genre, i) => (
                      <CustomDropdownCheckboxItem
                        key={`genre-${i}`}
                        checked={isGenreSelected(genre)}
                        onCheckedChange={() => toggleGenre(genre)}
                        onSelect={(e) => e.preventDefault()}
                        className="px-3 py-2 rounded-md hover:bg-accent focus:bg-accent transition-colors"
                      >
                        {genre}
                      </CustomDropdownCheckboxItem>
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="h-8 w-px bg-border mx-1" />

            {/* Sort Controls */}
            <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm rounded-md border border-border p-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1.5 text-sm font-medium text-foreground hover:bg-accent cursor-pointer"
                  >
                    <span>Sort by</span>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-48 bg-popover/95 backdrop-blur-sm border border-border shadow-lg"
                  align="end"
                >
                  <DropdownMenuLabel className="font-semibold text-popover-foreground">
                    Sort Options
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-border" />
                  {Array.from(SORT_OPTIONS).map((option) => {
                    const optionValue = option.toLowerCase().replace(" ", "_");
                    return (
                      <CustomDropdownCheckboxItem
                        key={option}
                        checked={sortBy === optionValue}
                        onCheckedChange={() => setSortBy(optionValue)}
                        onSelect={(e) => e.preventDefault()}
                        className="px-3 py-2 rounded-md hover:bg-accent focus:bg-accent transition-colors"
                      >
                        {option}
                      </CustomDropdownCheckboxItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Sort Order Toggle */}
              <Button
                variant="ghost"
                size="sm"
                className={`gap-1.5 text-sm font-medium transition-all cursor-pointer ${
                  sortOrder === "desc"
                    ? "bg-accent text-accent-foreground hover:bg-accent/80"
                    : "text-foreground hover:bg-accent"
                }`}
                onClick={() => {
                  const newOrder = sortOrder === "asc" ? "desc" : "asc";
                  console.log("Sort order changed to:", newOrder);
                  setSortOrder(newOrder);
                }}
              >
                {sortOrder === "desc" ? (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <path d="m3 16 4 4 4-4" />
                      <path d="M7 20V4" />
                      <path d="M11 4h10" />
                      <path d="M11 8h7" />
                      <path d="M11 12h4" />
                    </svg>
                    <span>Descending</span>
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <path d="m3 8 4-4 4 4" />
                      <path d="M7 4v16" />
                      <path d="M11 12h10" />
                      <path d="M11 16h7" />
                      <path d="M11 20h4" />
                    </svg>
                    <span>Ascending</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <MovieGrid movies={filteredMovies} />
    </div>
  );
}
