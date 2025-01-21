import { Router } from "express";
import { UrlController } from "../controller/url.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router=Router()
const urlcontroller=new UrlController()

router.post("/shorten",authMiddleware,urlcontroller.createShorturl);


export default router