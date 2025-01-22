import { Request, Response, NextFunction } from "express";
import { redisClient } from "../config/redis";
import ErrorResponse from "../utils/common/errorResponse";
import { json } from "stream/consumers";
import { StatusCode } from "../utils/common/HttpStatusCode ";

export const rateLimit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    const key = `ratelimit:${userId}`;

    // increment
    const count = await redisClient.incr(key);
    if (count == 1) {
      await redisClient.expire(key, 24 * 60 * 60);
    }
    if (count > 100) {
       res
        .status(StatusCode.TOO_MANY_REQUESTS)
        .json({ success: false, message: "Rate limit exceeded" });
        return 
    }
    next();
  } catch (error) {
    console.error("Error connecting to Redis:", error);
     res.status(500).json({ error: "Internal Server Error" });
     return
  }
};
