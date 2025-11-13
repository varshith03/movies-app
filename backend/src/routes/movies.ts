import { Router } from "express";
import { MovieController } from "../controllers/MovieController";

const router = Router();
const movieController = new MovieController();

// Public routes (movies can be viewed without authentication)
router.get("/", movieController.getMovies);
router.get("/export", movieController.exportMovies); // Must be before /:id route
router.get("/:id", movieController.getMovieById);

export default router;
