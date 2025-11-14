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
import { ChevronDown, Download, SortAsc, SortDesc, Filter } from "lucide-react";
import { MovieGrid } from "@/components/ui/movie-grid";
import { useInfiniteQuery } from "@tanstack/react-query";
import { movieApi } from "@/lib/api/api-calls";
import type { MovieApiResponse } from "@/types";
import { SearchBar } from "@/components/ui/search-bar";
import { downloadBlob } from "@/lib/utils";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(id);
  }, [searchTerm]);
  const [selectedGenres, setSelectedGenres] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState("popularity");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const genresCsv = Array.from(selectedGenres).sort().join(",");
  const effectiveSort = sortBy === "release_date" ? "year" : sortBy;

  const {
    data: response,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    // @ts-ignore
  } = useInfiniteQuery({
    queryKey: [
      "movies",
      {
        search: debouncedSearch,
        genres: genresCsv,
        sortBy: effectiveSort,
        sortOrder,
      },
    ],
    queryFn: ({ pageParam = 0 }) =>
      movieApi.fetchMovies({
        search: debouncedSearch,
        filter: genresCsv,
        sort: effectiveSort,
        sortOrder,
        limit: 10,
        offset: pageParam,
      }),
    getNextPageParam: (lastPage) => {
      if (!lastPage?.pagination) {
        console.error("Invalid lastPage structure:", lastPage);
        return undefined;
      }

      const { offset = 0, limit = 10, total = 0 } = lastPage.pagination;
      const nextOffset = offset+1;
      const hasMore = nextOffset < total;
      return hasMore ? nextOffset : undefined;
    },
    staleTime: 5 * 60 * 1000,
  });

  const movies = response?.pages.flatMap((page: any) => page.data) || [];

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

  const filteredMovies = movies
    .filter((movie) => {
      if (selectedGenres.size === 0) return true;
      return Array.from(selectedGenres).some((genre) =>
        movie.genre?.includes(genre)
      );
    })
    .filter((movie) =>
      movie.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const loadMore = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  if (isLoading && !response) {
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
  }

  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-background/95">
      <div className="flex flex-col space-y-4 mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            All Movies
          </h1>

          <div className="flex-1 min-w-[240px]">
            <SearchBar value={searchTerm} onChange={setSearchTerm} />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              title="Download CSV"
              className="inline-flex items-center justify-center h-9 w-9 rounded-md border border-input hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
              onClick={async () => {
                const blob = await movieApi.exportMovies();
                downloadBlob(blob, "movies_export.csv");
              }}
            >
              <Download className="h-4 w-4" />
              <span className="sr-only">Download CSV</span>
            </button>
            {/* Genre Filter */}
            <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm rounded-md border border-border p-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1.5 text-sm font-medium text-foreground hover:bg-accent cursor-pointer"
                  >
                    <Filter className="h-4 w-4" />
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
                    {Array.from(getUniqueGenres(movies)).map((genre, i) => (
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
                    <SortDesc className="h-4 w-4" />
                    <span>Descending</span>
                  </>
                ) : (
                  <>
                    <SortAsc className="h-4 w-4" />
                    <span>Ascending</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <MovieGrid movies={filteredMovies} className="mt-8" />
      {hasNextPage && (
        <div className="flex justify-center mt-8">
          <Button
            onClick={loadMore}
            disabled={isFetchingNextPage}
            className="px-8 py-6 text-lg cursor-pointer"
          >
            {isFetchingNextPage ? "Loading..." : "Show More"}
          </Button>
        </div>
      )}
    </div>
  );
}
