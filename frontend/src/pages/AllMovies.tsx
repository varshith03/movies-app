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
import { CheckIcon, ChevronDown } from "lucide-react";
import { MovieGrid } from "@/components/ui/MovieGrid";
import { useQuery } from "@tanstack/react-query";
import { movieApi } from "@/lib/api/movie-api";
import type { MovieApiResponse } from "@/types";

// Mock genres data - replace with actual data from your API
const GENRES = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 18, name: "Drama" },
  { id: 14, name: "Fantasy" },
  { id: 27, name: "Horror" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Science Fiction" },
  { id: 53, name: "Thriller" },
];

const SORT_OPTIONS = [
  { id: "popularity", label: "Popularity" },
  { id: "vote_average", label: "Rating" },
  { id: "release_date", label: "Release Date" },
  { id: "title", label: "Title" },
];


const mockMovies: MovieApiResponse[] = [
  {
    id: 1,
    title: "Inception",
    poster_path:
      "https://upload.wikimedia.org/wikipedia/en/2/2e/Inception_%282010%29_theatrical_poster.jpg",
    vote_average: 8.8,
    release_date: "2010-07-16",
    genre_ids: [28, 18, 878],
  },
  {
    id: 2,
    title: "The Dark Knight",
    poster_path: "",
    vote_average: 9.0,
    release_date: "2008-07-18",
    genre_ids: [28, 80, 18],
  },
  {
    id: 3,
    title: "The Shawshank Redemption",
    poster_path: "/posters/shawshank_redemption.jpg",
    vote_average: 9.3,
    release_date: "1994-09-23",
    genre_ids: [18, 80],
  },
  {
    id: 4,
    title: "The Godfather",
    poster_path: "/posters/the_godfather.jpg",
    vote_average: 9.2,
    release_date: "1972-03-24",
    genre_ids: [18, 80],
  },
  {
    id: 5,
    title: "Pulp Fiction",
    poster_path: "/posters/pulp_fiction.jpg",
    vote_average: 8.9,
    release_date: "1994-10-14",
    genre_ids: [80, 53, 35],
  },
  {
    id: 6,
    title: "Spirited Away",
    poster_path: "/posters/spirited_away.jpg",
    vote_average: 8.6,
    release_date: "2001-07-20",
    genre_ids: [16, 14, 18],
  },
  {
    id: 7,
    title: "The Matrix",
    poster_path: "/posters/the_matrix.jpg",
    vote_average: 8.7,
    release_date: "1999-03-31",
    genre_ids: [28, 878],
  },
  {
    id: 8,
    title: "Interstellar",
    poster_path: "/posters/interstellar.jpg",
    vote_average: 8.6,
    release_date: "2014-11-07",
    genre_ids: [12, 18, 878],
  },
  {
    id: 9,
    title: "Parasite",
    poster_path: "/posters/parasite.jpg",
    vote_average: 8.6,
    release_date: "2019-05-30",
    genre_ids: [35, 18, 53],
  },
  {
    id: 10,
    title: "The Lion King",
    poster_path: "/posters/the_lion_king.jpg",
    vote_average: 8.5,
    release_date: "1994-06-24",
    genre_ids: [16, 18, 12],
  },
  {
    id: 11,
    title: "Get Out",
    poster_path: "/posters/get_out.jpg",
    vote_average: 7.7,
    release_date: "2017-02-24",
    genre_ids: [27, 53, 35],
  },
  {
    id: 12,
    title: "Avengers: Endgame",
    poster_path: "/posters/avengers_endgame.jpg",
    vote_average: 8.4,
    release_date: "2019-04-26",
    genre_ids: [28, 12, 878],
  },
  {
    id: 13,
    title: "Toy Story",
    poster_path: "/posters/toy_story.jpg",
    vote_average: 8.3,
    release_date: "1995-11-22",
    genre_ids: [16, 35, 12],
  },
  {
    id: 14,
    title: "The Silence of the Lambs",
    poster_path: "/posters/silence_of_the_lambs.jpg",
    vote_average: 8.6,
    release_date: "1991-02-14",
    genre_ids: [80, 18, 53],
  },
  {
    id: 15,
    title: "Titanic",
    poster_path: "/posters/titanic.jpg",
    vote_average: 7.8,
    release_date: "1997-12-19",
    genre_ids: [18, 10749],
  },
  {
    id: 16,
    title: "Mad Max: Fury Road",
    poster_path: "/posters/mad_max_fury_road.jpg",
    vote_average: 8.1,
    release_date: "2015-05-15",
    genre_ids: [28, 12, 878],
  },
];

export function AllMovies() {
  const [movies, setMovies] = useState<MovieApiResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState("popularity");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

const { 
    data: moviess = [], 
    isLoading, 
    isError, 
    error 
  } = useQuery<MovieApiResponse[], Error>({
    queryKey: ['movies'],
    queryFn: movieApi.fetchMovies,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        // Replace with your actual API call
        // const response = await fetch('YOUR_API_ENDPOINT');
        // const data = await response.json();
        // setMovies(data.results);

        setMovies(mockMovies);
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

  const handleGenreToggle = (genreId: number) => {
    setSelectedGenres((prev) =>
      prev.includes(genreId)
        ? prev.filter((id) => id !== genreId)
        : [...prev, genreId]
    );
  };

  const filteredMovies = movies
    .filter((movie) =>
      movie.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(
      (movie) =>
        selectedGenres.length === 0 ||
        movie.genre_ids.some((genreId) => selectedGenres.includes(genreId))
    )
    .sort((a, b) => {
      let compareResult = 0;

      if (sortBy === "title") {
        compareResult = a.title.localeCompare(b.title);
      } else if (sortBy === "release_date") {
        compareResult =
          new Date(a.release_date).getTime() -
          new Date(b.release_date).getTime();
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
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-4 mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            All Movies
          </h1>

          <div className="flex flex-wrap items-center gap-3">
            {/* Genre Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 bg-white/80 backdrop-blur-sm hover:bg-white transition-all"
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
                  {selectedGenres.length > 0 && (
                    <span className="ml-1 bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs">
                      {selectedGenres.length}
                    </span>
                  )}
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 max-h-96 overflow-y-auto bg-white/95 backdrop-blur-sm border border-gray-200 shadow-lg"
                align="end"
              >
                <DropdownMenuLabel className="font-semibold text-gray-900">
                  Filter by Genre
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-100" />
                <div className="max-h-64 overflow-y-auto p-1">
                  {GENRES.map((genre) => (
                    <CustomDropdownCheckboxItem
                      key={genre.id}
                      checked={selectedGenres.includes(genre.id)}
                      onCheckedChange={() => handleGenreToggle(genre.id)}
                      className="px-3 py-2 rounded-md hover:bg-gray-50 focus:bg-gray-50 transition-colors"
                      onSelect={(e) => e.preventDefault()}
                    >
                      <span>{genre.name}</span>
                      {selectedGenres.includes(genre.id) && (
                        <CheckIcon className="h-4 w-4 text-primary ml-2" />
                      )}
                    </CustomDropdownCheckboxItem>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="h-8 w-px bg-gray-200 mx-1" />

            {/* Sort Controls */}
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-md border border-gray-200 p-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    <span>Sort by</span>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-48 bg-white/95 backdrop-blur-sm border border-gray-200 shadow-lg"
                  align="end"
                >
                  <DropdownMenuLabel className="font-semibold text-gray-900">
                    Sort Options
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-gray-100" />
                  {SORT_OPTIONS.map((option) => (
                    <CustomDropdownCheckboxItem
                      key={option.id}
                      checked={sortBy === option.id}
                      onCheckedChange={() => setSortBy(option.id)}
                      className="px-3 py-2 rounded-md hover:bg-gray-50 focus:bg-gray-50 transition-colors"
                      onSelect={(e) => e.preventDefault()}
                    >
                      <span>{option.label}</span>
                      {sortBy === option.id && (
                        <CheckIcon className="h-4 w-4 text-primary ml-2" />
                      )}
                    </CustomDropdownCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Sort Order Toggle */}
              <Button
                variant="ghost"
                size="sm"
                className={`gap-1.5 text-sm font-medium transition-all ${
                  sortOrder === "desc"
                    ? "bg-blue-50 text-primary hover:bg-blue-100"
                    : "text-gray-700 hover:bg-gray-100"
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
