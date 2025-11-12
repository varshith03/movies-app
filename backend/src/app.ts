import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

// Config imports
import { config } from './config/env.js';
import logger from './config/logger.js';
import { database } from './config/database.js';

// Middleware imports
import {
  errorHandler,
  notFoundHandler,
  apiLimiter,
  requestLoggingMiddleware,
  healthCheckLogger,
} from './middleware/index.js';

// Routes
import apiRoutes from './routes/index.js';

// Services
import { authService } from './services/AuthService.js';

class App {
  public express: express.Application;

  constructor() {
    this.express = express();
    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeSwagger();
    this.initializeErrorHandling();
  }

  private initializeMiddleware(): void {
    // Security middleware
    this.express.use(
      helmet({
        contentSecurityPolicy: {
          directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", 'fonts.googleapis.com'],
            fontSrc: ["'self'", 'fonts.gstatic.com'],
            imgSrc: ["'self'", 'data:', 'https:'],
            scriptSrc: ["'self'"],
          },
        },
        crossOriginEmbedderPolicy: false, // Allow for Swagger UI
      })
    );

    // CORS configuration
    this.express.use(
      cors({
        origin:
          config.NODE_ENV === 'production'
            ? ['https://yourdomain.com'] // Replace with actual production domains
            : ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000'],
        credentials: true,
        optionsSuccessStatus: 200,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
      })
    );

    // Compression middleware
    this.express.use(compression());

    // Body parsing middleware
    this.express.use(express.json({ limit: '10mb' }));
    this.express.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Logging middleware
    this.express.use(healthCheckLogger);

    // Rate limiting
    this.express.use(apiLimiter);

    // Trust proxy for accurate IP addresses
    this.express.set('trust proxy', 1);
  }

  private initializeRoutes(): void {
    // Health check route (before API routes for quick access)
    this.express.get('/health', (req, res) => {
      res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
      });
    });

    // API routes
    this.express.use('/api', apiRoutes);

    // Root route
    this.express.get('/', (req, res) => {
      res.status(200).json({
        message: 'MovieFlix Dashboard API',
        version: '1.0.0',
        docs: '/api/docs',
        health: '/health',
        timestamp: new Date().toISOString(),
      });
    });
  }

  private initializeSwagger(): void {
    const swaggerOptions = {
      definition: {
        openapi: '3.0.0',
        info: {
          title: 'MovieFlix Dashboard API',
          version: '1.0.0',
          description:
            'A production-ready Express.js API for movie data management with OMDb API integration, caching, authentication, and analytics.',
          contact: {
            name: 'MovieFlix Team',
            email: 'support@movieflix.com',
          },
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT',
          },
        },
        servers: [
          {
            url:
              config.NODE_ENV === 'production'
                ? 'https://your-api-domain.com' // Replace with actual production URL
                : `http://localhost:${config.PORT}`,
            description:
              config.NODE_ENV === 'production' ? 'Production server' : 'Development server',
          },
        ],
        components: {
          securitySchemes: {
            bearerAuth: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT',
            },
          },
          schemas: {
            Movie: {
              type: 'object',
              properties: {
                id: { type: 'string', example: 'tt1375666' },
                title: { type: 'string', example: 'Inception' },
                year: { type: 'integer', example: 2010 },
                genre: {
                  type: 'array',
                  items: { type: 'string' },
                  example: ['Action', 'Sci-Fi', 'Thriller'],
                },
                director: { type: 'string', example: 'Christopher Nolan' },
                actors: {
                  type: 'array',
                  items: { type: 'string' },
                  example: ['Leonardo DiCaprio', 'Marion Cotillard', 'Tom Hardy'],
                },
                rating: { type: 'number', example: 8.8 },
                runtime: { type: 'integer', example: 148 },
                plot: { type: 'string', example: 'A thief who steals corporate secrets...' },
              },
            },
            User: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                email: { type: 'string', format: 'email' },
                role: { type: 'string', enum: ['user', 'admin'] },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' },
              },
            },
            MovieAnalytics: {
              type: 'object',
              properties: {
                genreDistribution: {
                  type: 'object',
                  additionalProperties: { type: 'integer' },
                  example: { Action: 25, Comedy: 18, Drama: 22 },
                },
                averageRating: { type: 'number', example: 7.2 },
                averageRuntimeByYear: {
                  type: 'object',
                  additionalProperties: { type: 'number' },
                  example: { '2020': 120, '2021': 115, '2022': 118 },
                },
                totalMovies: { type: 'integer', example: 150 },
              },
            },
            PaginationMeta: {
              type: 'object',
              properties: {
                total: { type: 'integer' },
                page: { type: 'integer' },
                limit: { type: 'integer' },
                totalPages: { type: 'integer' },
                hasNextPage: { type: 'boolean' },
                hasPrevPage: { type: 'boolean' },
              },
            },
          },
        },
      },
      apis: ['./src/routes/*.ts'], // Path to the API files
    };

    const swaggerSpec = swaggerJsdoc(swaggerOptions);

    this.express.use(
      '/api/docs',
      swaggerUi.serve,
      swaggerUi.setup(swaggerSpec, {
        explorer: true,
        customCss: '.swagger-ui .topbar { display: none }',
        customSiteTitle: 'MovieFlix API Documentation',
      })
    );

    // Serve swagger.json
    this.express.get('/api/swagger.json', (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(swaggerSpec);
    });
  }

  private initializeErrorHandling(): void {
    // 404 handler
    this.express.use(notFoundHandler);

    // Global error handler
    this.express.use(errorHandler);
  }

  public async initialize(): Promise<void> {
    try {
      // Connect to database
      await database.connect();

      // Initialize admin user
      await authService.initializeAdminUser();

      logger.info('Application initialized successfully');
    } catch (error) {
      logger.error('Application initialization failed:', error);
      throw error;
    }
  }

  public getExpressApp(): express.Application {
    return this.express;
  }
}

export default App;
