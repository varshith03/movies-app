import { Router } from "express";
import { MovieController } from "../controllers/MovieController";

const router = Router();
const movieController = new MovieController();

router.get("/", movieController.getMovies);
router.get("/export", movieController.exportMovies);
router.get("/:id", movieController.getMovieById);

export default router;
