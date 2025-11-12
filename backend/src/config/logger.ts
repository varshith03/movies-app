import winston from 'winston';
import path from 'path';
import { config } from './env.js';

// Custom log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.colorize({ all: true }),
  winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
    const metaStr = Object.keys(meta).length > 0 ? JSON.stringify(meta) : '';
    const logMessage = `${timestamp} [${level}]: ${message}${metaStr ? ' ' + metaStr : ''}`;
    return stack ? `${logMessage}\n${stack}` : logMessage;
  })
);

// File log format (no colors)
const fileLogFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Create logs directory if it doesn't exist
const logsDir = path.dirname(config.LOG_FILE);

const transports: winston.transport[] = [
  // Console transport
  new winston.transports.Console({
    level: config.LOG_LEVEL,
    format: logFormat,
  }),
];

// Add file transport in non-test environment
if (config.NODE_ENV !== 'test') {
  transports.push(
    // Error log file
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      format: fileLogFormat,
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5,
    }),
    // Combined log file
    new winston.transports.File({
      filename: config.LOG_FILE,
      level: config.LOG_LEVEL,
      format: fileLogFormat,
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5,
    })
  );
}

// Create logger instance
export const logger = winston.createLogger({
  level: config.LOG_LEVEL,
  transports,
  // Don't exit on handled exceptions
  exitOnError: false,
  // Handle uncaught exceptions
  exceptionHandlers: config.NODE_ENV !== 'test' ? [
    new winston.transports.File({ 
      filename: path.join(logsDir, 'exceptions.log'),
      format: fileLogFormat,
    })
  ] : [],
  // Handle unhandled promise rejections
  rejectionHandlers: config.NODE_ENV !== 'test' ? [
    new winston.transports.File({ 
      filename: path.join(logsDir, 'rejections.log'),
      format: fileLogFormat,
    })
  ] : [],
});

// Create request logger for Express
export const requestLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: config.NODE_ENV !== 'test' ? [
    new winston.transports.File({
      filename: path.join(logsDir, 'requests.log'),
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5,
    })
  ] : [],
});

export default logger;