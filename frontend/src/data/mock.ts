import type { Movie, CastMember } from "../types";

export const MOCK_MOVIE: Movie = {
  id: 1,
  title: "The Dark Knight",
  overview: "When the menace known as the Joker wreaks havoc ...",
  poster_path: "/assets/posters/dark-knight.jpg", // or full URL
  backdrop_path: "/assets/backdrops/dark-knight-bg.jpg",
  vote_average: 9.0,
  release_date: "2008-07-16",
  runtime: 152,
  genres: [
    { id: 18, name: "Drama" },
    { id: 28, name: "Action" },
    { id: 80, name: "Crime" },
    { id: 53, name: "Thriller" },
  ],
  budget: 185000000,
  revenue: 1006234167,
  status: "Released",
  director: "Christopher Nolan",
  original_language: "English",
  studio: "Warner Bros. Pictures",
  screenwriter: "Jonathan Nolan",
};

export const MOCK_CAST: CastMember[] = [
  {
    id: 1,
    name: "Christian Bale",
    character: "Bruce Wayne",
    profile_path: "/assets/people/bale.jpg",
  },
  {
    id: 2,
    name: "Heath Ledger",
    character: "Joker",
    profile_path: "/assets/people/ledger.jpg",
  },
  // ... more
];
