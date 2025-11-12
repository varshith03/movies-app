import axios from 'axios';
import { config } from '@/config/env.js';
import logger from '@/config/logger.js';
import { Movie, OmdbMovieResponse, OmdbSearchResponse } from '@/types/index.js';

export class ExternalMovieService {
  private static instance: ExternalMovieService;
  private omdbApiKey: string;

  private constructor() {
    this.omdbApiKey = config.OMDB_API_KEY;
  }

  public static getInstance(): ExternalMovieService {
    if (!ExternalMovieService.instance) {
      ExternalMovieService.instance = new ExternalMovieService();
    }
    return ExternalMovieService.instance;
  }

  public async searchMovies(query: string, page = 1): Promise<Movie[]> {
    try {
      return await this.searchMoviesOMDB(query, page);
    } catch (error) {
      logger.error('External movie search failed:', error);
      throw new Error('Failed to search movies from external API');
    }
  }

  public async getMovieById(id: string): Promise<Movie | null> {
    try {
      return await this.getMovieByIdOMDB(id);
    } catch (error) {
      logger.error('External movie fetch failed:', error);
      throw new Error('Failed to fetch movie from external API');
    }
  }

  private async searchMoviesOMDB(query: string, page: number): Promise<Movie[]> {
    const response = await axios.get<OmdbSearchResponse>('http://www.omdbapi.com/', {
      params: {
        apikey: this.omdbApiKey,
        s: query,
        type: 'movie',
        page,
      },
      timeout: 10000,
    });

    if (response.data.Response === 'False') {
      if (response.data.Error === 'Movie not found!') {
        return [];
      }
      throw new Error(response.data.Error || 'OMDb API error');
    }

    if (!response.data.Search) {
      return [];
    }

    // Get detailed info for each movie
    const detailedMovies = await Promise.allSettled(
      response.data.Search.map(movie => this.getMovieByIdOMDB(movie.imdbID))
    );

    return detailedMovies
      .filter(
        (result): result is PromiseFulfilledResult<Movie | null> =>
          result.status === 'fulfilled' && result.value !== null
      )
      .map(result => result.value as Movie);
  }

  private async getMovieByIdOMDB(imdbId: string): Promise<Movie | null> {
    const response = await axios.get<OmdbMovieResponse>('http://www.omdbapi.com/', {
      params: {
        apikey: this.omdbApiKey,
        i: imdbId,
        plot: 'full',
      },
      timeout: 10000,
    });

    if (response.data.Response === 'False') {
      logger.warn(`Movie not found: ${imdbId}`);
      return null;
    }

    return this.transformOmdbToMovie(response.data);
  }

  private transformOmdbToMovie(omdbMovie: OmdbMovieResponse): Movie {
    return {
      id: omdbMovie.imdbID,
      title: omdbMovie.Title,
      year: parseInt(omdbMovie.Year) || 0,
      genre: omdbMovie.Genre ? omdbMovie.Genre.split(', ') : [],
      director: omdbMovie.Director || 'Unknown',
      actors: omdbMovie.Actors ? omdbMovie.Actors.split(', ') : [],
      rating: parseFloat(omdbMovie.imdbRating || '0') || 0,
      runtime: this.parseRuntime(omdbMovie.Runtime || '0'),
      plot: omdbMovie.Plot || 'No plot available',
    };
  }

  private parseRuntime(runtime: string): number {
    const match = runtime.match(/(\d+)/);
    return match ? parseInt(match[1]!) : 0;
  }
}

export const externalMovieService = ExternalMovieService.getInstance();
