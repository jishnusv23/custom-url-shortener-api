import { Router } from "express";
import { AuthController } from "../controller/auth.controller";

const router = Router();

const authController = new AuthController();

router.post("/google", authController.googleAuth);

export default router;
