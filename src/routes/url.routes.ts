import { Router } from "express";
import { UrlController } from "../controller/url.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { rateLimit } from "../middleware/rateLimiter";

const router=Router()
const urlcontroller=new UrlController()

router.post("/shorten",authMiddleware,rateLimit,urlcontroller.createShorturl);
router.get("/shorten/:alias",urlcontroller.redirectUrl);


export default router