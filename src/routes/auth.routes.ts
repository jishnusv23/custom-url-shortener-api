import { Router } from "express";
import { AuthController } from "../controller/auth.controller";

const router = Router();
const authController = new AuthController();

/**
 * @openapi
 * /google:
 *   post:
 *     summary: Google Authentication
 *     description: Authenticate user with Google OAuth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: Google ID token
 *     responses:
 *       200:
 *         description: Successful authentication
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 token:
 *                   type: string
 *                   description: JWT authentication token
 *                 user:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                     id:
 *                       type: string
 *                     googleId:
 *                       type: string
 */
router.post("/google", authController.googleAuth);

/**
 * @openapi
 * /logout:
 *   post:
 *     summary: User Logout
 *     description: Log out the current user
 *     responses:
 *       200:
 *         description: Successful logout
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: string
 *                   example: ""
 *                 message:
 *                   type: string
 *                   example: "Successful"
 */
router.post("/logout", authController.logout);

export default router;
