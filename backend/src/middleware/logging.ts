import { Request, Response, NextFunction } from 'express';
import { requestLogger } from '@/config/logger.js';

export const requestLoggingMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const startTime = Date.now();
  
  // Log request
  requestLogger.info('Request started', {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString(),
  });

  // Override res.end to capture response data
  const originalEnd = res.end;
  res.end = function(chunk?: any, encoding?: any) {
    const duration = Date.now() - startTime;
    
    // Log response
    requestLogger.info('Request completed', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      timestamp: new Date().toISOString(),
    });

    // Call original end method
    originalEnd.call(this, chunk, encoding);
  };

  next();
};

// Health check endpoint - lightweight logging
export const healthCheckLogger = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (req.path === '/health' || req.path === '/api/health') {
    // Skip detailed logging for health checks
    return next();
  }
  
  return requestLoggingMiddleware(req, res, next);
};