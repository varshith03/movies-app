import { Request, Response, NextFunction } from 'express';
import { movieService } from '@/services/MovieService.js';
import logger from '@/config/logger.js';
import { MovieSearchQuery, ApiResponse } from '@/types/index.js';
import * as createCsvWriter from 'csv-writer';
import path from 'path';
import { promises as fs } from 'fs';

export class MovieController {
  public async searchMovies(
    req: Request,
    res: Response<ApiResponse<any>>,
    next: NextFunction
  ): Promise<void> {
    try {
      const {
        search = '',
        sort = 'rating',
        filter,
        limit = '20',
        page = '1',
      } = req.query as Record<string, string>;

      const searchQuery: MovieSearchQuery = {
        search,
        sort: sort as 'rating' | 'year' | 'title',
        ...(filter && { filter }),
        limit: Math.min(parseInt(limit) || 20, 100), // Max 100 per page
        page: Math.max(parseInt(page) || 1, 1), // Min page 1
      };

      const result = await movieService.searchMovies(searchQuery);

      res.status(200).json({
        success: true,
        data: result.movies,
        meta: result.meta,
        message: `Found ${result.meta.total} movies`,
      });
    } catch (error) {
      logger.error('Movie search controller error:', error);
      next(error);
    }
  }

  public async getMovieById(
    req: Request,
    res: Response<ApiResponse<any>>,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          data: null,
          message: 'Movie ID is required',
        });
        return;
      }

      const movie = await movieService.getMovieById(id);

      if (!movie) {
        res.status(404).json({
          success: false,
          data: null,
          message: 'Movie not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: movie,
        message: 'Movie retrieved successfully',
      });
    } catch (error) {
      logger.error('Get movie by ID controller error:', error);
      next(error);
    }
  }

  public async getAnalytics(
    _req: Request,
    res: Response<ApiResponse<any>>,
    next: NextFunction
  ): Promise<void> {
    try {
      const analytics = await movieService.getAnalytics();

      res.status(200).json({
        success: true,
        data: analytics,
        message: 'Analytics retrieved successfully',
      });
    } catch (error) {
      logger.error('Analytics controller error:', error);
      next(error);
    }
  }

  public async exportMovies(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const format = (req.query['format'] as string) || 'json';

      if (!['json', 'csv'].includes(format)) {
        res.status(400).json({
          success: false,
          data: null,
          message: 'Invalid format. Use "json" or "csv"',
        });
        return;
      }

      const movies = await movieService.exportMovies(format as 'json' | 'csv');

      if (format === 'json') {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', 'attachment; filename="movies.json"');
        res.status(200).json({
          success: true,
          data: movies,
          message: `Exported ${movies.length} movies`,
        });
        return;
      }

      // CSV Export
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `movies_export_${timestamp}.csv`;
      const filePath = path.join(process.cwd(), 'temp', filename);

      // Ensure temp directory exists
      await fs.mkdir(path.dirname(filePath), { recursive: true });

      const csvWriter = createCsvWriter.createObjectCsvWriter({
        path: filePath,
        header: [
          { id: 'id', title: 'ID' },
          { id: 'title', title: 'Title' },
          { id: 'year', title: 'Year' },
          { id: 'genre', title: 'Genres' },
          { id: 'director', title: 'Director' },
          { id: 'actors', title: 'Actors' },
          { id: 'rating', title: 'Rating' },
          { id: 'runtime', title: 'Runtime (minutes)' },
          { id: 'plot', title: 'Plot' },
        ],
      });

      // Transform data for CSV
      const csvData = movies.map(movie => ({
        ...movie,
        genre: movie.genre.join('; '),
        actors: movie.actors.join('; '),
      }));

      await csvWriter.writeRecords(csvData);

      // Send file
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

      const fileBuffer = await fs.readFile(filePath);
      res.status(200).send(fileBuffer);

      // Clean up temp file
      await fs.unlink(filePath).catch(err => logger.warn('Failed to delete temp CSV file:', err));
    } catch (error) {
      logger.error('Export controller error:', error);
      next(error);
    }
  }
}

export const movieController = new MovieController();
