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

    // Build MongoDB filter
    const mongoFilter: FilterQuery<IMovie> = {};

    // Handle search functionality
    if (search) {
      mongoFilter.$or = [{ title: { $regex: search, $options: "i" } }];
    }

    // Handle genre filtering (format: "genre:Sci-Fi" or "genre:Drama,Adventure")
    if (filter) {
      const [filterType, filterValue] = filter.split(":");
      if (filterType === "genre" && filterValue) {
        // Handle comma-separated genre values
        const genres = filterValue.split(",").map((genre) => genre.trim());

        if (genres.length === 1) {
          // Single genre - use $elemMatch with regex for partial matching in array
          mongoFilter.genre = {
            $elemMatch: { $regex: genres[0], $options: "i" },
          };
        } else {
          // Multiple genres - find movies that contain any of the specified genres
          mongoFilter.genre = {
            $in: genres.map((genre) => new RegExp(genre, "i")),
          };
        }
      }
    }

    // Build sort options
    const sortDirection: SortOrder = sortOrder === "asc" ? 1 : -1;
    let sortOptions: Record<string, SortOrder> = { _id: 1 }; // default sort by id (oldest first)

    if (sort === "rating") {
      sortOptions = { rating: sortDirection };
    } else if (sort === "year") {
      sortOptions = { year: sortDirection };
    }

    // Execute queries
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
