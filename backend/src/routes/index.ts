import { Router } from 'express';
import moviesRouter from './movies.js';
import authRouter from './auth.js';
import healthRouter from './health.js';

const router = Router();

// Mount routes
router.use('/movies', moviesRouter);
router.use('/auth', authRouter);
router.use('/health', healthRouter);

// Root endpoint
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'MovieFlix Dashboard API',
    version: '1.0.0',
    documentation: '/api/docs',
    endpoints: {
      movies: '/api/movies',
      auth: '/api/auth',
      health: '/api/health',
    },
  });
});

export default router;