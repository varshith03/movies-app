import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { authenticateToken } from "../middleware/auth";

const router = Router();
const authController = new AuthController();

router.post("/login", authController.login);
router.get("/profile", authenticateToken, authController.profile);

export default router;
