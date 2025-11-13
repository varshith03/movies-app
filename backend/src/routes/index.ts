import { Router } from "express";
import authRoutes from "./auth";
import movieRoutes from "./movies";

const router = Router();

// Route prefixes
router.use("/auth", authRoutes);
router.use("/movies", movieRoutes);

// Health check endpoint
router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Movies API is running",
    timestamp: new Date().toISOString(),
  });
});

export default router;
