import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { IUser, IAuthToken } from "../types";

// Predefined users as per requirements
const USERS: IUser[] = [
  {
    username: "user",
    password: bcrypt.hashSync("user123", 10),
    role: "user",
  },
  {
    username: "admin",
    password: bcrypt.hashSync("admin123", 10),
    role: "admin",
  },
];

export class AuthService {
  private static instance: AuthService;
  private readonly jwtSecret: string;

  private constructor() {
    this.jwtSecret = process.env.JWT_SECRET || "";
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public async validateCredentials(
    username: string,
    password: string
  ): Promise<IUser | null> {
    const user = USERS.find((u) => u.username === username);

    if (!user) {
      return null;
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return null;
    }

    return {
      username: user.username,
      password: "", // Don't return password
      role: user.role,
    };
  }

  public generateToken(user: IUser): string {
    const payload: IAuthToken = {
      username: user.username,
      role: user.role,
    };

    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: "24h",
      issuer: "movies-app",
      audience: "movies-app-users",
    });
  }

  public verifyToken(token: string): IAuthToken | null {
    try {
      const decoded = jwt.verify(token, this.jwtSecret, {
        issuer: "movies-app",
        audience: "movies-app-users",
      }) as IAuthToken;

      return decoded;
    } catch (error) {
      return null;
    }
  }
}
