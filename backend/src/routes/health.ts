import { Router } from 'express';
import { Request, Response } from 'express';
import { database } from '@/config/database.js';
import { config } from '@/config/env.js';

const router = Router();

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check
 *     description: Check if the API is running and database is connected
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: healthy
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 database:
 *                   type: string
 *                   example: connected
 *                 environment:
 *                   type: string
 *                 version:
 *                   type: string
 *       503:
 *         description: Service is unhealthy
 */
router.get('/', (_req: Request, res: Response) => {
  try {
    const isDbConnected = database.isDbConnected();

    if (!isDbConnected) {
      return res.status(503).json({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        database: 'disconnected',
        environment: config.NODE_ENV,
        version: process.env['npm_package_version'] || '1.0.0',
      });
    }

    return res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      environment: config.NODE_ENV,
      version: process.env['npm_package_version'] || '1.0.0',
    });
  } catch (error) {
    return res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      database: 'error',
      environment: config.NODE_ENV,
      version: process.env['npm_package_version'] || '1.0.0',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
