import { z } from 'zod';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Environment validation schema
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('3001'),
  
  // External API
  OMDB_API_KEY: z.string().min(1, 'OMDb API key is required'),
  TMDB_API_KEY: z.string().optional(),
  MOVIE_API_PROVIDER: z.enum(['omdb', 'tmdb']).default('omdb'),
  
  // Database
  MONGODB_URI: z.string().url('Valid MongoDB URI is required'),
  DB_NAME: z.string().default('movieflix-dashboard'),
  
  // JWT
  JWT_SECRET: z.string().min(32, 'JWT secret must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  
  // Cache
  CACHE_TTL_HOURS: z.string().transform(Number).default('24'),
  ENABLE_CACHE: z.string().transform(val => val === 'true').default('true'),
  
  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.string().transform(Number).default('900000'),
  RATE_LIMIT_MAX_REQUESTS: z.string().transform(Number).default('100'),
  
  // Admin User
  ADMIN_EMAIL: z.string().email('Valid admin email is required'),
  ADMIN_PASSWORD: z.string().min(6, 'Admin password must be at least 6 characters'),
  
  // Logging
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  LOG_FILE: z.string().default('logs/app.log'),
  
  // Pagination
  DEFAULT_PAGE_SIZE: z.string().transform(Number).default('20'),
  MAX_PAGE_SIZE: z.string().transform(Number).default('100'),
  
  // Export
  MAX_EXPORT_RECORDS: z.string().transform(Number).default('10000'),
});

// Validate and parse environment variables
const parseEnv = () => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(err => 
        `${err.path.join('.')}: ${err.message}`
      ).join('\n');
      throw new Error(`Environment validation failed:\n${errorMessages}`);
    }
    throw error;
  }
};

export const config = parseEnv();

export type Config = typeof config;