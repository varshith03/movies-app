import { Router } from 'express';
import { movieController } from '@/controllers/MovieController.js';
import { authMiddleware, adminMiddleware, optionalAuthMiddleware } from '@/middleware/auth.js';
import { searchLimiter } from '@/middleware/rateLimiter.js';
import { asyncHandler } from '@/middleware/errorHandler.js';

const router = Router();

/**
 * @swagger
 * /api/movies:
 *   get:
 *     summary: Search movies
 *     description: Search for movies with optional filtering and sorting
 *     tags: [Movies]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Movie title to search for
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [rating, year, title]
 *         description: Sort movies by rating, year, or title
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *         description: Filter by genre (e.g., "genre:Sci-Fi")
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Number of movies per page (max 100)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number
 *     responses:
 *       200:
 *         description: Movies retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Movie'
 *                 meta:
 *                   $ref: '#/components/schemas/PaginationMeta'
 */
router.get(
  '/',
  searchLimiter,
  optionalAuthMiddleware,
  asyncHandler(movieController.searchMovies.bind(movieController))
);

/**
 * @swagger
 * /api/movies/{id}:
 *   get:
 *     summary: Get movie by ID
 *     description: Retrieve detailed information about a specific movie
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Movie ID (IMDb ID or TMDB ID)
 *     responses:
 *       200:
 *         description: Movie retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Movie'
 *       404:
 *         description: Movie not found
 */
router.get(
  '/:id',
  optionalAuthMiddleware,
  asyncHandler(movieController.getMovieById.bind(movieController))
);

/**
 * @swagger
 * /api/movies/analytics:
 *   get:
 *     summary: Get movie analytics
 *     description: Retrieve analytics data including genre distribution and average ratings
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Analytics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/MovieAnalytics'
 *       401:
 *         description: Authentication required
 */
router.get(
  '/analytics',
  authMiddleware,
  asyncHandler(movieController.getAnalytics.bind(movieController))
);

/**
 * @swagger
 * /api/movies/export:
 *   get:
 *     summary: Export movies
 *     description: Export movies in JSON or CSV format
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *           enum: [json, csv]
 *         description: Export format (json or csv)
 *     responses:
 *       200:
 *         description: Movies exported successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Movie'
 *           text/csv:
 *             schema:
 *               type: string
 *       401:
 *         description: Authentication required
 */
router.get(
  '/export',
  authMiddleware,
  adminMiddleware,
  asyncHandler(movieController.exportMovies.bind(movieController))
);

export default router;