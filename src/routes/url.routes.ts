import { Router } from "express";
import { UrlController } from "../controller/url.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { rateLimit } from "../middleware/rateLimiter";

const router=Router()
const urlcontroller=new UrlController()
/**
 * @openapi
 * /shorten:
 *   post:
 *     summary: Create a short URL
 *     description: Generate a shortened URL with optional custom alias and topic
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               longUrl:
 *                 type: string
 *                 description: The original long URL to be shortened
 *               customAlias:
 *                 type: string
 *                 description: Optional custom alias for the short URL
 *               topic:
 *                 type: string
 *                 description: Optional topic associated with the URL
 *     responses:
 *       201:
 *         description: Short URL created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 shortUrl:
 *                   type: string
 *                   description: The full short URL
 *                 originalUrl:
 *                   type: string
 *                   description: The original long URL
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: Timestamp of URL creation
 *                 topic:
 *                   type: string
 *                   description: Topic associated with the URL
 *       400:
 *         description: Invalid URL or alias
 *       429:
 *         description: Too many requests, rate limit exceeded
 * 
 */
 
router.post("/shorten",authMiddleware,rateLimit,urlcontroller.createShorturl);

/**
 * @openapi
 * /shorten:
 * /shorten/{alias}:
 *   get:
 *     summary: Redirect to original URL
 *     description: Redirects to the original URL using the short URL alias
 *     parameters:
 *       - in: path
 *         name: alias
 *         required: true
 *         schema:
 *           type: string
 *         description: The alias of the short URL
 *     responses:
 *       302:
 *         description: Successful redirect to original URL
 *       404:
 *         description: Short URL not found
 */

router.get("/shorten/:alias",urlcontroller.redirectUrl);


export default router