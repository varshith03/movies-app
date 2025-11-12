import { Request, Response, NextFunction } from 'express';
import { authService } from '@/services/AuthService.js';
import logger from '@/config/logger.js';
import { JwtPayload } from '@/types/index.js';

// Extend Request interface to include user
declare module 'express' {
  interface Request {
    user?: JwtPayload;
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: {
          message: 'Authorization header missing or invalid format',
          code: 'UNAUTHORIZED',
          statusCode: 401,
        },
      });
      return;
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      res.status(401).json({
        success: false,
        error: {
          message: 'Token missing',
          code: 'UNAUTHORIZED',
          statusCode: 401,
        },
      });
      return;
    }

    try {
      const decoded = await authService.verifyToken(token);
      req.user = decoded;
      next();
    } catch (error) {
      logger.warn('Token verification failed:', error);
      res.status(401).json({
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Token verification failed',
          code: 'UNAUTHORIZED',
          statusCode: 401,
        },
      });
    }
  } catch (error) {
    logger.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error',
        code: 'INTERNAL_SERVER_ERROR',
        statusCode: 500,
      },
    });
  }
};

export const adminMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: {
          message: 'Authentication required',
          code: 'UNAUTHORIZED',
          statusCode: 401,
        },
      });
      return;
    }

    if (req.user.role !== 'admin') {
      res.status(403).json({
        success: false,
        error: {
          message: 'Admin access required',
          code: 'FORBIDDEN',
          statusCode: 403,
        },
      });
      return;
    }

    next();
  } catch (error) {
    logger.error('Admin middleware error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error',
        code: 'INTERNAL_SERVER_ERROR',
        statusCode: 500,
      },
    });
  }
};

// Optional auth middleware - doesn't require authentication but adds user info if present
export const optionalAuthMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];

      if (token) {
        try {
          const decoded = await authService.verifyToken(token);
          req.user = decoded;
        } catch (error) {
          // Silently fail for optional auth
          logger.debug('Optional auth failed:', error);
        }
      }
    }

    next();
  } catch (error) {
    logger.error('Optional auth middleware error:', error);
    next(); // Continue even if there's an error
  }
};
