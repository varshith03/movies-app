import { Request, Response, NextFunction } from 'express';
import { authService } from '@/services/AuthService.js';
import logger from '@/config/logger.js';
import { LoginRequest, ApiResponse } from '@/types/index.js';

export class AuthController {
  public async login(
    req: Request<{}, any, LoginRequest>,
    res: Response<ApiResponse<any>>,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        res.status(400).json({
          success: false,
          data: null,
          message: 'Email and password are required',
        });
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        res.status(400).json({
          success: false,
          data: null,
          message: 'Invalid email format',
        });
        return;
      }

      const result = await authService.login({ email, password });

      res.status(200).json({
        success: true,
        data: result,
        message: 'Login successful',
      });

      logger.info(`Successful login for user: ${email}`);
    } catch (error) {
      logger.error('Login controller error:', error);

      if (error instanceof Error && error.message === 'Invalid credentials') {
        res.status(401).json({
          success: false,
          data: null,
          message: 'Invalid email or password',
        });
        return;
      }

      next(error);
    }
  }

  public async register(
    req: Request<{}, any, { email: string; password: string; role?: 'admin' | 'user' }>,
    res: Response<ApiResponse<any>>,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email, password, role } = req.body;

      // Validate input
      if (!email || !password) {
        res.status(400).json({
          success: false,
          data: null,
          message: 'Email and password are required',
        });
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        res.status(400).json({
          success: false,
          data: null,
          message: 'Invalid email format',
        });
        return;
      }

      // Validate password strength
      if (password.length < 6) {
        res.status(400).json({
          success: false,
          data: null,
          message: 'Password must be at least 6 characters long',
        });
        return;
      }

      const user = await authService.createUser({
        email,
        password,
        ...(role && { role }),
      });

      res.status(201).json({
        success: true,
        data: user,
        message: 'User registered successfully',
      });

      logger.info(`New user registered: ${email}`);
    } catch (error) {
      logger.error('Registration controller error:', error);

      if (error instanceof Error && error.message === 'User already exists') {
        res.status(409).json({
          success: false,
          data: null,
          message: 'User with this email already exists',
        });
        return;
      }

      next(error);
    }
  }

  public async getProfile(
    req: Request & { user?: any },
    res: Response<ApiResponse<any>>,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          data: null,
          message: 'Authentication required',
        });
        return;
      }

      const user = await authService.getUserById(req.user.userId);

      if (!user) {
        res.status(404).json({
          success: false,
          data: null,
          message: 'User not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: user,
        message: 'Profile retrieved successfully',
      });
    } catch (error) {
      logger.error('Get profile controller error:', error);
      next(error);
    }
  }

  public async refreshToken(
    req: Request & { user?: any },
    res: Response<ApiResponse<any>>,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          data: null,
          message: 'Authentication required',
        });
        return;
      }

      // Generate new token with current user data
      const result = await authService.login({
        email: req.user.email,
        password: 'dummy', // This won't be used since we're not validating password
      });

      res.status(200).json({
        success: true,
        data: { token: result.token },
        message: 'Token refreshed successfully',
      });
    } catch (error) {
      logger.error('Refresh token controller error:', error);
      next(error);
    }
  }
}

export const authController = new AuthController();
