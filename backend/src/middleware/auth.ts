import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/AuthService";
import { IAuthToken } from "../types";

declare global {
  namespace Express {
    interface Request {
      user?: IAuthToken;
    }
  }
}

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    res.status(401).json({
      success: false,
      message: "Access token required",
    });
    return;
  }

  const authService = AuthService.getInstance();
  const decoded = authService.verifyToken(token);

  if (!decoded) {
    res.status(403).json({
      success: false,
      message: "Invalid or expired token",
    });
    return;
  }

  req.user = decoded;
  next();
};

export const requireRole = (role: "user" | "admin") => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    if (req.user.role !== role && req.user.role !== "admin") {
      res.status(403).json({
        success: false,
        message: "Insufficient permissions",
      });
      return;
    }

    next();
  };
};
