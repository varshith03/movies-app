import type { Movie, MovieApiResponse } from "../types";

export const MOCK_MOVIE: Movie = {
  id: "1",
  title: "The Matrix",
  year: 1999,
  genre: ["Action", "Sci-Fi"],
  director: "Lana Wachowski",
  actors: [
    "Keanu Reeves",
    "Laurence Fishburne",
    "Carrie-Anne Moss",
    "Hugo Weaving",
  ],
  runtime: 136,
  rating: 8.7,
  plot: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
  box_office: "$463,517,383",
  screenwriter: "Lilly Wachowski, Lana Wachowski",
  studio: "Warner Bros. Pictures",
  day: 10,
  month: 5,
  poster_url:
    "https://resizing.flixster.com/EhnZhhnlXPpQk_tXymRE5RpssVs=/ems.cHJkLWVtcy1hc3NldHMvbW92aWVzL2VjMDc3ODZmLTUyOTEtNGE1NC04NzM5LTQyZGJkMjQxMWM1ZC5qcGc=",
};

export const allMovies: MovieApiResponse[] = [
  {
    id: "1",
    title: "The Matrix",
    year: 1999,
    genre: ["Action", "Sci-Fi"],

    rating: 8.7,
    poster_url:
      "https://resizing.flixster.com/EhnZhhnlXPpQk_tXymRE5RpssVs=/ems.cHJkLWVtcy1hc3NldHMvbW92aWVzL2VjMDc3ODZmLTUyOTEtNGE1NC04NzM5LTQyZGJkMjQxMWM1ZC5qcGc=",
  },
  {
    id: "2",
    title: "The Godfather",
    year: 1972,
    genre: ["Crime", "Drama"],

    rating: 9.2,
    poster_url:
      "https://resizing.flixster.com/EhnZhhnlXPpQk_tXymRE5RpssVs=/ems.cHJkLWVtcy1hc3NldHMvbW92aWVzL2VjMDc3ODZmLTUyOTEtNGE1NC04NzM5LTQyZGJkMjQxMWM1ZC5qcGc=",
  },
  {
    id: "3",
    title: "Pulp Fiction",
    year: 1994,
    genre: ["Crime", "Drama"],

    rating: 8.9,
    poster_url:
      "https://resizing.flixster.com/EhnZhhnlXPpQk_tXymRE5RpssVs=/ems.cHJkLWVtcy1hc3NldHMvbW92aWVzL2VjMDc3ODZmLTUyOTEtNGE1NC04NzM5LTQyZGJkMjQxMWM1ZC5qcGc=",
  },
  {
    id: "4",
    title: "The Dark Knight",
    year: 2008,
    genre: ["Action", "Crime", "Drama"],

    runtime: 152,
    rating: 9,
    poster_url:
      "https://resizing.flixster.com/EhnZhhnlXPpQk_tXymRE5RpssVs=/ems.cHJkLWVtcy1hc3NldHMvbW92aWVzL2VjMDc3ODZmLTUyOTEtNGE1NC04NzM5LTQyZGJkMjQxMWM1ZC5qcGc=",
  },
  {
    id: "4",
    title: "The Dark Knight",
    year: 2008,
    genre: ["Action", "Crime", "Drama"],

    runtime: 152,
    rating: 9,
    poster_url:
      "https://resizing.flixster.com/EhnZhhnlXPpQk_tXymRE5RpssVs=/ems.cHJkLWVtcy1hc3NldHMvbW92aWVzL2VjMDc3ODZmLTUyOTEtNGE1NC04NzM5LTQyZGJkMjQxMWM1ZC5qcGc=",
  },
  {
    id: "4",
    title: "The Dark Knight",
    year: 2008,
    genre: ["Action", "Crime", "Drama"],

    runtime: 152,
    rating: 9,
    poster_url:
      "https://resizing.flixster.com/EhnZhhnlXPpQk_tXymRE5RpssVs=/ems.cHJkLWVtcy1hc3NldHMvbW92aWVzL2VjMDc3ODZmLTUyOTEtNGE1NC04NzM5LTQyZGJkMjQxMWM1ZC5qcGc=",
  },
  {
    id: "4",
    title: "The Dark Knight",
    year: 2008,
    genre: ["Action", "Crime", "Drama"],

    runtime: 152,
    rating: 9,
    poster_url:
      "https://resizing.flixster.com/EhnZhhnlXPpQk_tXymRE5RpssVs=/ems.cHJkLWVtcy1hc3NldHMvbW92aWVzL2VjMDc3ODZmLTUyOTEtNGE1NC04NzM5LTQyZGJkMjQxMWM1ZC5qcGc=",
  },
  {
    id: "4",
    title: "The Dark Knight",
    year: 2008,
    genre: ["Action", "Crime", "Drama"],

    runtime: 152,
    rating: 9,
    poster_url:
      "https://resizing.flixster.com/EhnZhhnlXPpQk_tXymRE5RpssVs=/ems.cHJkLWVtcy1hc3NldHMvbW92aWVzL2VjMDc3ODZmLTUyOTEtNGE1NC04NzM5LTQyZGJkMjQxMWM1ZC5qcGc=",
  },
  {
    id: "4",
    title: "The Dark Knight",
    year: 2008,
    genre: ["Action", "Crime", "Drama"],

    runtime: 152,
    rating: 9,
    poster_url:
      "https://resizing.flixster.com/EhnZhhnlXPpQk_tXymRE5RpssVs=/ems.cHJkLWVtcy1hc3NldHMvbW92aWVzL2VjMDc3ODZmLTUyOTEtNGE1NC04NzM5LTQyZGJkMjQxMWM1ZC5qcGc=",
  },
  {
    id: "4",
    title: "The Dark Knight",
    year: 2008,
    genre: ["Action", "Crime", "Drama"],

    runtime: 152,
    rating: 9,
    poster_url:
      "https://resizing.flixster.com/EhnZhhnlXPpQk_tXymRE5RpssVs=/ems.cHJkLWVtcy1hc3NldHMvbW92aWVzL2VjMDc3ODZmLTUyOTEtNGE1NC04NzM5LTQyZGJkMjQxMWM1ZC5qcGc=",
  },
  {
    id: "4",
    title: "The Dark Knight",
    year: 2008,
    genre: ["Action", "Crime", "Drama"],

    runtime: 152,
    rating: 9,
    poster_url:
      "https://resizing.flixster.com/EhnZhhnlXPpQk_tXymRE5RpssVs=/ems.cHJkLWVtcy1hc3NldHMvbW92aWVzL2VjMDc3ODZmLTUyOTEtNGE1NC04NzM5LTQyZGJkMjQxMWM1ZC5qcGc=",
  },
  {
    id: "4",
    title: "The Dark Knight",
    year: 2008,
    genre: ["Action", "Crime", "Drama"],

    runtime: 152,
    rating: 9,
    poster_url:
      "https://resizing.flixster.com/EhnZhhnlXPpQk_tXymRE5RpssVs=/ems.cHJkLWVtcy1hc3NldHMvbW92aWVzL2VjMDc3ODZmLTUyOTEtNGE1NC04NzM5LTQyZGJkMjQxMWM1ZC5qcGc=",
  },
  {
    id: "4",
    title: "The Dark Knight",
    year: 2008,
    genre: ["Action", "Crime", "Drama"],

    runtime: 152,
    rating: 9,
    poster_url:
      "https://resizing.flixster.com/EhnZhhnlXPpQk_tXymRE5RpssVs=/ems.cHJkLWVtcy1hc3NldHMvbW92aWVzL2VjMDc3ODZmLTUyOTEtNGE1NC04NzM5LTQyZGJkMjQxMWM1ZC5qcGc=",
  },
  {
    id: "4",
    title: "The Dark Knight",
    year: 2008,
    genre: ["Action", "Crime", "Drama"],

    runtime: 152,
    rating: 9,
    poster_url:
      "https://resizing.flixster.com/EhnZhhnlXPpQk_tXymRE5RpssVs=/ems.cHJkLWVtcy1hc3NldHMvbW92aWVzL2VjMDc3ODZmLTUyOTEtNGE1NC04NzM5LTQyZGJkMjQxMWM1ZC5qcGc=",
  },
  {
    id: "4",
    title: "The Dark Knight",
    year: 2008,
    genre: ["Action", "Crime", "Drama"],

    runtime: 152,
    rating: 9,
    poster_url:
      "https://resizing.flixster.com/EhnZhhnlXPpQk_tXymRE5RpssVs=/ems.cHJkLWVtcy1hc3NldHMvbW92aWVzL2VjMDc3ODZmLTUyOTEtNGE1NC04NzM5LTQyZGJkMjQxMWM1ZC5qcGc=",
  },
  {
    id: "4",
    title: "The Dark Knight",
    year: 2008,
    genre: ["Action", "Crime", "Drama"],

    runtime: 152,
    rating: 9,
    poster_url:
      "https://resizing.flixster.com/EhnZhhnlXPpQk_tXymRE5RpssVs=/ems.cHJkLWVtcy1hc3NldHMvbW92aWVzL2VjMDc3ODZmLTUyOTEtNGE1NC04NzM5LTQyZGJkMjQxMWM1ZC5qcGc=",
  },
  {
    id: "4",
    title: "The Dark Knight",
    year: 2008,
    genre: ["Action", "Crime", "Drama"],

    runtime: 152,
    rating: 9,
    poster_url:
      "https://resizing.flixster.com/EhnZhhnlXPpQk_tXymRE5RpssVs=/ems.cHJkLWVtcy1hc3NldHMvbW92aWVzL2VjMDc3ODZmLTUyOTEtNGE1NC04NzM5LTQyZGJkMjQxMWM1ZC5qcGc=",
  },
  {
    id: "4",
    title: "The Dark Knight",
    year: 2008,
    genre: ["Action", "Crime", "Drama"],

    runtime: 152,
    rating: 9,
    poster_url:
      "https://resizing.flixster.com/EhnZhhnlXPpQk_tXymRE5RpssVs=/ems.cHJkLWVtcy1hc3NldHMvbW92aWVzL2VjMDc3ODZmLTUyOTEtNGE1NC04NzM5LTQyZGJkMjQxMWM1ZC5qcGc=",
  },
  {
    id: "4",
    title: "The Dark Knight",
    year: 2008,
    genre: ["Action", "Crime", "Drama"],

    runtime: 152,
    rating: 9,
    poster_url:
      "https://resizing.flixster.com/EhnZhhnlXPpQk_tXymRE5RpssVs=/ems.cHJkLWVtcy1hc3NldHMvbW92aWVzL2VjMDc3ODZmLTUyOTEtNGE1NC04NzM5LTQyZGJkMjQxMWM1ZC5qcGc=",
  },
  {
    id: "4",
    title: "The Dark Knight",
    year: 2008,
    genre: ["Action", "Crime", "Drama"],

    runtime: 152,
    rating: 9,
    poster_url:
      "https://resizing.flixster.com/EhnZhhnlXPpQk_tXymRE5RpssVs=/ems.cHJkLWVtcy1hc3NldHMvbW92aWVzL2VjMDc3ODZmLTUyOTEtNGE1NC04NzM5LTQyZGJkMjQxMWM1ZC5qcGc=",
  },
  {
    id: "4",
    title: "The Dark Knight",
    year: 2008,
    genre: ["Action", "Crime", "Drama"],

    runtime: 152,
    rating: 9,
    poster_url:
      "https://resizing.flixster.com/EhnZhhnlXPpQk_tXymRE5RpssVs=/ems.cHJkLWVtcy1hc3NldHMvbW92aWVzL2VjMDc3ODZmLTUyOTEtNGE1NC04NzM5LTQyZGJkMjQxMWM1ZC5qcGc=",
  },
  {
    id: "4",
    title: "The Dark Knight",
    year: 2008,
    genre: ["Action", "Crime", "Drama"],

    runtime: 152,
    rating: 9,
    poster_url:
      "https://resizing.flixster.com/EhnZhhnlXPpQk_tXymRE5RpssVs=/ems.cHJkLWVtcy1hc3NldHMvbW92aWVzL2VjMDc3ODZmLTUyOTEtNGE1NC04NzM5LTQyZGJkMjQxMWM1ZC5qcGc=",
  },
  {
    id: "4",
    title: "The Dark Knight",
    year: 2008,
    genre: ["Action", "Crime", "Drama"],

    runtime: 152,
    rating: 9,
    poster_url:
      "https://resizing.flixster.com/EhnZhhnlXPpQk_tXymRE5RpssVs=/ems.cHJkLWVtcy1hc3NldHMvbW92aWVzL2VjMDc3ODZmLTUyOTEtNGE1NC04NzM5LTQyZGJkMjQxMWM1ZC5qcGc=",
  },
  {
    id: "4",
    title: "The Dark Knight",
    year: 2008,
    genre: ["Action", "Crime", "Drama"],

    runtime: 152,
    rating: 9,
    poster_url:
      "https://resizing.flixster.com/EhnZhhnlXPpQk_tXymRE5RpssVs=/ems.cHJkLWVtcy1hc3NldHMvbW92aWVzL2VjMDc3ODZmLTUyOTEtNGE1NC04NzM5LTQyZGJkMjQxMWM1ZC5qcGc=",
  },
  {
    id: "4",
    title: "The Dark Knight",
    year: 2008,
    genre: ["Action", "Crime", "Drama"],

    runtime: 152,
    rating: 9,
    poster_url:
      "https://resizing.flixster.com/EhnZhhnlXPpQk_tXymRE5RpssVs=/ems.cHJkLWVtcy1hc3NldHMvbW92aWVzL2VjMDc3ODZmLTUyOTEtNGE1NC04NzM5LTQyZGJkMjQxMWM1ZC5qcGc=",
  },
  {
    id: "4",
    title: "The Dark Knight",
    year: 2008,
    genre: ["Action", "Crime", "Drama"],

    runtime: 152,
    rating: 9,
    poster_url:
      "https://resizing.flixster.com/EhnZhhnlXPpQk_tXymRE5RpssVs=/ems.cHJkLWVtcy1hc3NldHMvbW92aWVzL2VjMDc3ODZmLTUyOTEtNGE1NC04NzM5LTQyZGJkMjQxMWM1ZC5qcGc=",
  },
  {
    id: "4",
    title: "The Dark Knight",
    year: 2008,
    genre: ["Action", "Crime", "Drama"],

    runtime: 152,
    rating: 9,
    poster_url:
      "https://resizing.flixster.com/EhnZhhnlXPpQk_tXymRE5RpssVs=/ems.cHJkLWVtcy1hc3NldHMvbW92aWVzL2VjMDc3ODZmLTUyOTEtNGE1NC04NzM5LTQyZGJkMjQxMWM1ZC5qcGc=",
  },
  {
    id: "4",
    title: "The Dark Knight",
    year: 2008,
    genre: ["Action", "Crime", "Drama"],

    runtime: 152,
    rating: 9,
    poster_url:
      "https://resizing.flixster.com/EhnZhhnlXPpQk_tXymRE5RpssVs=/ems.cHJkLWVtcy1hc3NldHMvbW92aWVzL2VjMDc3ODZmLTUyOTEtNGE1NC04NzM5LTQyZGJkMjQxMWM1ZC5qcGc=",
  },
  {
    id: "4",
    title: "The Dark Knight",
    year: 2008,
    genre: ["Action", "Crime", "Drama"],

    runtime: 152,
    rating: 9,
    poster_url:
      "https://resizing.flixster.com/EhnZhhnlXPpQk_tXymRE5RpssVs=/ems.cHJkLWVtcy1hc3NldHMvbW92aWVzL2VjMDc3ODZmLTUyOTEtNGE1NC04NzM5LTQyZGJkMjQxMWM1ZC5qcGc=",
  },
  {
    id: "4",
    title: "The Dark Knight",
    year: 2008,
    genre: ["Action", "Crime", "Drama"],

    runtime: 152,
    rating: 9,
    poster_url:
      "https://resizing.flixster.com/EhnZhhnlXPpQk_tXymRE5RpssVs=/ems.cHJkLWVtcy1hc3NldHMvbW92aWVzL2VjMDc3ODZmLTUyOTEtNGE1NC04NzM5LTQyZGJkMjQxMWM1ZC5qcGc=",
  },
  {
    id: "4",
    title: "The Dark Knight",
    year: 2008,
    genre: ["Action", "Crime", "Drama"],

    runtime: 152,
    rating: 9,
    poster_url:
      "https://resizing.flixster.com/EhnZhhnlXPpQk_tXymRE5RpssVs=/ems.cHJkLWVtcy1hc3NldHMvbW92aWVzL2VjMDc3ODZmLTUyOTEtNGE1NC04NzM5LTQyZGJkMjQxMWM1ZC5qcGc=",
  },
  {
    id: "4",
    title: "The Dark Knight",
    year: 2008,
    genre: ["Action", "Crime", "Drama"],

    runtime: 152,
    rating: 9,
    poster_url:
      "https://resizing.flixster.com/EhnZhhnlXPpQk_tXymRE5RpssVs=/ems.cHJkLWVtcy1hc3NldHMvbW92aWVzL2VjMDc3ODZmLTUyOTEtNGE1NC04NzM5LTQyZGJkMjQxMWM1ZC5qcGc=",
  },
];
