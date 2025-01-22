import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { rateLimit } from "../middleware/rateLimiter";
import { AnalyticsCotroller } from "../controller/analytics.controller";

const router = Router();
const analyticscotroller=new AnalyticsCotroller()

router.get('/:alias',authMiddleware,rateLimit,analyticscotroller.getAnalytics)


export default router