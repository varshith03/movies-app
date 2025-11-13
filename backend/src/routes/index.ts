import { Router } from "express";
import authRoutes from "./auth";
import movieRoutes from "./movies";

const router = Router();

router.use("/auth", authRoutes);
router.use("/movies", movieRoutes);

router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Movies API is running",
    timestamp: new Date().toISOString(),
  });
});

export default router;
