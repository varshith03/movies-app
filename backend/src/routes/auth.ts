import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { authenticateToken } from "../middleware/auth";

const router = Router();
const authController = new AuthController();

// Public routes
router.post("/login", authController.login);

// Protected routes
router.get("/profile", authenticateToken, authController.profile);

export default router;
