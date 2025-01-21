import { createClient } from "redis";
import { config } from "dotenv";
config();

export const redisClient = createClient({
  username: "default",
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_URL,
    port: Number(process.env.REDIS_PORT),
  },
});
redisClient.on("connect", () => {
  console.log("💡redis connected successfully.....");
});

redisClient.on("error", (err) => {
  console.error("Redis connection error:", err);
});

export const connectRedis = async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
      console.log("💡redis connected successfully.....");
    }
  } catch (error) {
    console.error('Something wrong in connect redis',error);    
  }
};
