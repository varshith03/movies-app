import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import connectDB from "./config/database";
import routes from "./routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
});

app.use(limiter);

app.use(cors());

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

app.use("/api", routes);
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Movies API Server",
    version: "1.0.0",
    endpoints: {
      health: "/api/health",
      login: "POST /api/auth/login",
      profile: "GET /api/auth/profile",
      movies: "GET /api/movies",
      movieById: "GET /api/movies/:id",
      exportMovies: "GET /api/movies/export",
    },
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found",
  });
});

app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Global error:", err);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
);

const startServer = async (): Promise<void> => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📚 API Documentation: http://localhost:${PORT}/`);
      console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
      console.log(`🎬 Movies Endpoint: http://localhost:${PORT}/api/movies`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully");
  process.exit(0);
});

startServer();

export default app;
