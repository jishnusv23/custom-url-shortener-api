import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { rateLimit } from "../middleware/rateLimiter";
import { AnalyticsCotroller } from "../controller/analytics.controller";

const router = Router();
const analyticscotroller = new AnalyticsCotroller();

/**
 * @openapi
 * /overall:
 *   get:
 *     summary: Get Overall URL Analytics
 *     description: Retrieve comprehensive analytics for all user URLs
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful analytics retrieval
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalUrls:
 *                   type: integer
 *                   example: 50
 *                 totalClicks:
 *                   type: integer
 *                   example: 1000
 *                 totalUniqueUsers:
 *                   type: integer
 *                   example: 25
 *                 clicksByDate:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         format: date
 *                         example: "2025-01-01"
 *                       clicks:
 *                         type: integer
 *                         example: 2
 *                 osTypeAnalytics:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       osName:
 *                         type: string
 *                         example: "windows"
 *                       uniqueClicks:
 *                         type: integer
 *                         example: 15
 *                       uniqueUsers:
 *                         type: integer
 *                         example: 5
 *                 deviceTypeAnalytics:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       deviceName:
 *                         type: string
 *                         example: "desktop"
 *                       uniqueClicks:
 *                         type: integer
 *                         example: 10
 *                       uniqueUsers:
 *                         type: integer
 *                         example: 10
 */
router.get(
  "/overall",
  authMiddleware,
  rateLimit,
  analyticscotroller.OverallAnalytics
);

/**
 * @openapi
 * /topic/{topic}:
 *   get:
 *     summary: Get Topic-Based URL Analytics
 *     description: Retrieve analytics for URLs with a specific topic
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: topic
 *         required: true
 *         schema:
 *           type: string
 *         description: Topic of the URLs
 *     responses:
 *       200:
 *         description: Successful topic analytics retrieval
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 shortUrl:
 *                   type: string
 *                   example: "abc123"
 *                 totalClicks:
 *                   type: integer
 *                   example: 100
 *                 uniqueUsers:
 *                   type: integer
 *                   example: 20
 *                 clicksByDate:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         format: date
 *                         example: "2025-01-01"
 *                       clicks:
 *                         type: integer
 *                         example: 2
 */
router.get(
  "/topic/:topic",
  authMiddleware,
  rateLimit,
  analyticscotroller.TopicBasedAnalytics
);

/**
 * @openapi
 * /{alias}:
 *   get:
 *     summary: Get URL-Specific Analytics
 *     description: Retrieve detailed analytics for a specific short URL
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: alias
 *         required: true
 *         schema:
 *           type: string
 *         description: Alias of the short URL
 *     responses:
 *       200:
 *         description: Successful URL-specific analytics retrieval
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 alias:
 *                   type: string
 *                   example: "abc123"
 *                 originalUrl:
 *                   type: string
 *                   example: "https://example.com"
 *                 totalClicks:
 *                   type: integer
 *                   example: 100
 *                 uniqueUsers:
 *                   type: integer
 *                   example: 20
 *                 clicksByDate:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         format: date
 *                         example: "2025-01-01"
 *                       clicks:
 *                         type: integer
 *                         example: 2
 *                 osTypeAnalytics:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       osName:
 *                         type: string
 *                         example: "windows"
 *                       uniqueClicks:
 *                         type: integer
 *                         example: 15
 *                       uniqueUsers:
 *                         type: integer
 *                         example: 5
 *                 deviceTypeAnalytics:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       deviceName:
 *                         type: string
 *                         example: "desktop"
 *                       uniqueClicks:
 *                         type: integer
 *                         example: 10
 *                       uniqueUsers:
 *                         type: integer
 *                         example: 10
 *                 analytics:
 *                   type: object
 *                   description: Additional detailed analytics
 */
router.get(
  "/:alias",
  authMiddleware,
  rateLimit,
  analyticscotroller.getAnalytics
);

export default router;
