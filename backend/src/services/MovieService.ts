import { MovieModel, IMovieDocument } from '@/models/Movie.js';
import { externalMovieService } from './ExternalMovieService.js';
import { config } from '@/config/env.js';
import logger from '@/config/logger.js';
import { Movie, MovieSearchQuery, MovieAnalytics, PaginationMeta } from '@/types/index.js';

export class MovieService {
  private static instance: MovieService;
  private cacheEnabled: boolean;
  private cacheTtlHours: number;

  private constructor() {
    this.cacheEnabled = config.ENABLE_CACHE;
    this.cacheTtlHours = config.CACHE_TTL_HOURS;
  }

  public static getInstance(): MovieService {
    if (!MovieService.instance) {
      MovieService.instance = new MovieService();
    }
    return MovieService.instance;
  }

  public async searchMovies(query: MovieSearchQuery): Promise<{
    movies: Movie[];
    meta: PaginationMeta;
  }> {
    try {
      const {
        search = '',
        sort = 'rating',
        filter,
        limit = config.DEFAULT_PAGE_SIZE,
        page = 1,
      } = query;

      const offset = (page - 1) * limit;

      // Try cache first if enabled
      if (this.cacheEnabled && search) {
        const cachedResults = await this.searchFromCache({
          search,
          sort,
          ...(filter && { filter }),
          limit,
          offset,
        });

        if (cachedResults.movies.length > 0) {
          logger.info(`Cache hit for search: ${search}`);
          return cachedResults;
        }
      }

      // Fetch from external API
      logger.info(`Fetching from external API: ${search}`);
      const externalMovies = await externalMovieService.searchMovies(search, page);

      // Cache the results
      if (this.cacheEnabled && externalMovies.length > 0) {
        await this.cacheMovies(externalMovies);
      }

      // Apply filtering and sorting
      const filteredMovies = this.applyFilters(externalMovies, filter);
      const sortedMovies = this.applySorting(filteredMovies, sort);

      // Apply pagination
      const paginatedMovies = sortedMovies.slice(offset, offset + limit);
      const totalMovies = sortedMovies.length;

      const meta: PaginationMeta = {
        total: totalMovies,
        page,
        limit,
        totalPages: Math.ceil(totalMovies / limit),
        hasNextPage: page * limit < totalMovies,
        hasPrevPage: page > 1,
      };

      return { movies: paginatedMovies, meta };
    } catch (error) {
      logger.error('Movie search failed:', error);
      throw error;
    }
  }

  public async getMovieById(id: string): Promise<Movie | null> {
    try {
      // Check cache first
      if (this.cacheEnabled) {
        const cachedMovie = await MovieModel.findOne({
          id,
          expiresAt: { $gt: new Date() },
        });

        if (cachedMovie) {
          logger.info(`Cache hit for movie: ${id}`);
          return this.transformToMovie(cachedMovie);
        }
      }

      // Fetch from external API
      logger.info(`Fetching movie from external API: ${id}`);
      const externalMovie = await externalMovieService.getMovieById(id);

      if (!externalMovie) {
        return null;
      }

      // Cache the result
      if (this.cacheEnabled) {
        await this.cacheMovie(externalMovie);
      }

      return externalMovie;
    } catch (error) {
      logger.error('Movie fetch failed:', error);
      throw error;
    }
  }

  public async getAnalytics(): Promise<MovieAnalytics> {
    try {
      const movies = await MovieModel.find({
        expiresAt: { $gt: new Date() },
      });

      const genreDistribution: Record<string, number> = {};
      const runtimeByYear: Record<string, { total: number; count: number }> = {};
      let totalRating = 0;
      let ratingCount = 0;

      movies.forEach(movie => {
        // Genre distribution
        movie.genre.forEach(genre => {
          genreDistribution[genre] = (genreDistribution[genre] || 0) + 1;
        });

        // Rating calculation
        if (movie.rating > 0) {
          totalRating += movie.rating;
          ratingCount++;
        }

        // Runtime by year
        const yearStr = movie.year.toString();
        if (!runtimeByYear[yearStr]) {
          runtimeByYear[yearStr] = { total: 0, count: 0 };
        }
        runtimeByYear[yearStr].total += movie.runtime;
        runtimeByYear[yearStr].count++;
      });

      // Calculate average runtime by year
      const averageRuntimeByYear: Record<string, number> = {};
      Object.entries(runtimeByYear).forEach(([year, data]) => {
        averageRuntimeByYear[year] = Math.round(data.total / data.count);
      });

      return {
        genreDistribution,
        averageRating: ratingCount > 0 ? Math.round((totalRating / ratingCount) * 100) / 100 : 0,
        averageRuntimeByYear,
        totalMovies: movies.length,
      };
    } catch (error) {
      logger.error('Analytics generation failed:', error);
      throw error;
    }
  }

  public async exportMovies(_format: 'json' | 'csv' = 'json'): Promise<Movie[]> {
    try {
      const movies = await MovieModel.find({
        expiresAt: { $gt: new Date() },
      }).limit(config.MAX_EXPORT_RECORDS);

      return movies.map(movie => this.transformToMovie(movie));
    } catch (error) {
      logger.error('Movie export failed:', error);
      throw error;
    }
  }

  private async searchFromCache(query: {
    search: string;
    sort: string;
    filter?: string;
    limit: number;
    offset: number;
  }): Promise<{ movies: Movie[]; meta: PaginationMeta }> {
    const { search, sort, filter, limit, offset } = query;

    // Build search query
    const searchQuery: any = {
      expiresAt: { $gt: new Date() },
      $text: { $search: search },
    };

    // Apply filters
    if (filter) {
      const [filterType, filterValue] = filter.split(':');
      if (filterType === 'genre') {
        searchQuery.genre = { $in: [filterValue] };
      }
    }

    // Build sort query
    const sortQuery: any = {};
    switch (sort) {
      case 'rating':
        sortQuery.rating = -1;
        break;
      case 'year':
        sortQuery.year = -1;
        break;
      case 'title':
        sortQuery.title = 1;
        break;
      default:
        sortQuery.rating = -1;
    }

    // Get total count
    const total = await MovieModel.countDocuments(searchQuery);

    // Get paginated results
    const movies = await MovieModel.find(searchQuery).sort(sortQuery).skip(offset).limit(limit);

    const meta: PaginationMeta = {
      total,
      page: Math.floor(offset / limit) + 1,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: offset + limit < total,
      hasPrevPage: offset > 0,
    };

    return {
      movies: movies.map(movie => this.transformToMovie(movie)),
      meta,
    };
  }

  private async cacheMovies(movies: Movie[]): Promise<void> {
    try {
      const operations = movies.map(movie => ({
        updateOne: {
          filter: { id: movie.id },
          update: {
            ...movie,
            expiresAt: new Date(Date.now() + this.cacheTtlHours * 60 * 60 * 1000),
          },
          upsert: true,
        },
      }));

      await MovieModel.bulkWrite(operations);
      logger.info(`Cached ${movies.length} movies`);
    } catch (error) {
      logger.error('Failed to cache movies:', error);
    }
  }

  private async cacheMovie(movie: Movie): Promise<void> {
    try {
      await MovieModel.findOneAndUpdate(
        { id: movie.id },
        {
          ...movie,
          expiresAt: new Date(Date.now() + this.cacheTtlHours * 60 * 60 * 1000),
        },
        { upsert: true, new: true }
      );
      logger.info(`Cached movie: ${movie.title}`);
    } catch (error) {
      logger.error('Failed to cache movie:', error);
    }
  }

  private applyFilters(movies: Movie[], filter?: string): Movie[] {
    if (!filter) return movies;

    const [filterType, filterValue] = filter.split(':');

    if (!filterValue) return movies;

    switch (filterType) {
      case 'genre':
        return movies.filter(movie =>
          movie.genre.some(g => g.toLowerCase().includes(filterValue.toLowerCase()))
        );
      default:
        return movies;
    }
  }

  private applySorting(movies: Movie[], sort: string): Movie[] {
    const moviesCopy = [...movies];

    switch (sort) {
      case 'rating':
        return moviesCopy.sort((a, b) => b.rating - a.rating);
      case 'year':
        return moviesCopy.sort((a, b) => b.year - a.year);
      case 'title':
        return moviesCopy.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return moviesCopy.sort((a, b) => b.rating - a.rating);
    }
  }

  private transformToMovie(movieDoc: IMovieDocument): Movie {
    return {
      id: movieDoc.id,
      title: movieDoc.title,
      year: movieDoc.year,
      genre: movieDoc.genre,
      director: movieDoc.director,
      actors: movieDoc.actors,
      rating: movieDoc.rating,
      runtime: movieDoc.runtime,
      plot: movieDoc.plot,
    };
  }
}

export const movieService = MovieService.getInstance();
