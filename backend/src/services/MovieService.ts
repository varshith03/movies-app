import { Movie } from "../models/Movie";
import { IMovie, IMovieQuery, IPaginatedResponse } from "../types";
import { FilterQuery, SortOrder } from "mongoose";

export class MovieService {
  public async getMovies(
    query: IMovieQuery
  ): Promise<IPaginatedResponse<IMovie>> {
    const {
      search,
      sort,
      sortOrder = "desc",
      filter,
      limit = 10,
      offset = 0,
    } = query;

    const mongoFilter: FilterQuery<IMovie> = {};

    if (search) {
      mongoFilter.$or = [{ title: { $regex: search, $options: "i" } }];
    }

    if (filter) {
      const [filterType, filterValue] = filter.split(":");
      if (filterType === "genre" && filterValue) {
        const genres = filterValue.split(",").map((genre) => genre.trim());

        if (genres.length === 1) {
          mongoFilter.genre = {
            $elemMatch: { $regex: genres[0], $options: "i" },
          };
        } else {
          mongoFilter.genre = {
            $in: genres.map((genre) => new RegExp(genre, "i")),
          };
        }
      }
    }

    const sortDirection: SortOrder = sortOrder === "asc" ? 1 : -1;
    let sortOptions: Record<string, SortOrder> = { id: 1 };

    if (sort === "rating") {
      // Sort by rating first, then id as tiebreaker
      sortOptions = { rating: sortDirection, id: 1 };
    } else if (sort === "year") {
      // Sort by year first, then id as tiebreaker
      sortOptions = { year: sortDirection, id: 1 };
    }

    const [movies, total] = await Promise.all([
      Movie.find(mongoFilter)
        .sort(sortOptions)
        .limit(Number(limit))
        .skip(Number(offset))
        .exec(),
      Movie.countDocuments(mongoFilter).exec(),
    ]);

    return {
      data: movies,
      pagination: {
        total,
        limit: Number(limit),
        offset: Number(offset),
        hasNext: Number(offset) + Number(limit) < total,
        hasPrev: Number(offset) > 0,
      },
    };
  }

  public async getMovieById(id: string): Promise<IMovie | null> {
    try {
      const movie = await Movie.findById(id).exec();
      return movie;
    } catch (error) {
      return null;
    }
  }

  public async getAllMoviesForExport(): Promise<IMovie[]> {
    return await Movie.find({}).sort({ title: 1 }).exec();
  }

  public async createMovie(movieData: Partial<IMovie>): Promise<IMovie> {
    const movie = new Movie(movieData);
    return await movie.save();
  }

  public async updateMovie(
    id: string,
    movieData: Partial<IMovie>
  ): Promise<IMovie | null> {
    try {
      const movie = await Movie.findByIdAndUpdate(id, movieData, {
        new: true,
        runValidators: true,
      }).exec();
      return movie;
    } catch (error) {
      return null;
    }
  }

  public async deleteMovie(id: string): Promise<boolean> {
    try {
      const result = await Movie.findByIdAndDelete(id).exec();
      return result !== null;
    } catch (error) {
      return false;
    }
  }
}
