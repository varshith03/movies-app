import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = AuthService.getInstance();
  }

  public login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { username, password } = req.body;

      // Validate input
      if (!username || !password) {
        res.status(400).json({
          success: false,
          message: "Username and password are required",
        });
        return;
      }

      // Validate credentials
      const user = await this.authService.validateCredentials(
        username,
        password
      );

      if (!user) {
        res.status(401).json({
          success: false,
          message: "Invalid username or password",
        });
        return;
      }

      // Generate JWT token
      const token = this.authService.generateToken(user);

      res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
          token,
          user: {
            username: user.username,
            role: user.role,
          },
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };

  public profile = (req: Request, res: Response): void => {
    res.status(200).json({
      success: true,
      data: {
        user: req.user,
      },
    });
  };
}
