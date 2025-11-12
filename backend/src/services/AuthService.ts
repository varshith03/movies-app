import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { UserModel, IUserDocument } from '@/models/User.js';
import { config } from '@/config/env.js';
import logger from '@/config/logger.js';
import { LoginRequest, LoginResponse, JwtPayload, User } from '@/types/index.js';

export class AuthService {
  private static instance: AuthService;
  private jwtSecret: string;
  private jwtExpiresIn: string;

  private constructor() {
    this.jwtSecret = config.JWT_SECRET;
    this.jwtExpiresIn = config.JWT_EXPIRES_IN;
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const { email, password } = credentials;

      // Find user by email
      const user = await UserModel.findOne({ email: email.toLowerCase() });
      if (!user) {
        throw new Error('Invalid credentials');
      }

      // Verify password
      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        throw new Error('Invalid credentials');
      }

      // Generate JWT token
      const token = this.generateToken({
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      });

      logger.info(`User logged in: ${email}`);

      return {
        token,
        user: {
          id: user._id.toString(),
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        } as Omit<User, 'password'>,
      };
    } catch (error) {
      logger.error('Login failed:', error);
      throw error;
    }
  }

  public async createUser(userData: {
    email: string;
    password: string;
    role?: 'admin' | 'user';
  }): Promise<Omit<User, 'password'>> {
    try {
      const { email, password, role = 'user' } = userData;

      // Check if user already exists
      const existingUser = await UserModel.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        throw new Error('User already exists');
      }

      // Create new user
      const user = new UserModel({
        email: email.toLowerCase(),
        password,
        role,
      });

      await user.save();

      logger.info(`User created: ${email}`);

      return {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    } catch (error) {
      logger.error('User creation failed:', error);
      throw error;
    }
  }

  public async verifyToken(token: string): Promise<JwtPayload> {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as JwtPayload;
      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Token expired');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Invalid token');
      }
      throw new Error('Token verification failed');
    }
  }

  public async getUserById(userId: string): Promise<Omit<User, 'password'> | null> {
    try {
      const user = await UserModel.findById(userId);
      if (!user) {
        return null;
      }

      return {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    } catch (error) {
      logger.error('Get user failed:', error);
      throw error;
    }
  }

  public async initializeAdminUser(): Promise<void> {
    try {
      const adminEmail = config.ADMIN_EMAIL;
      const adminPassword = config.ADMIN_PASSWORD;

      // Check if admin user already exists
      const existingAdmin = await UserModel.findOne({ 
        email: adminEmail,
        role: 'admin'
      });

      if (existingAdmin) {
        logger.info('Admin user already exists');
        return;
      }

      // Create admin user
      await this.createUser({
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
      });

      logger.info('Admin user initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize admin user:', error);
      throw error;
    }
  }

  private generateToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.jwtExpiresIn,
    });
  }
}

export const authService = AuthService.getInstance();