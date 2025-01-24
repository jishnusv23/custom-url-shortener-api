import "reflect-metadata";
import express, { Request, Response, Application } from "express";
import { config } from "dotenv";
import morgan from "morgan";
import { AppDataSource } from "./config/database";
import authRoutes from "./routes/auth.routes";
import urlRoutes from "./routes/url.routes";
import analyticsRoutes from "./routes/analytics.routes";
import { errorHandler } from "./utils/common/errorHandler";
import { connectRedis } from "./config/redis";
import swaggerOptions from "./config/swagger";
import swaggerui from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
config();

const app: Application = express();
const PORT: number = Number(process.env.PORT || 3001);

app.use(morgan("dev"));
app.use(express.json());

const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use("/api/doc", swaggerui.serve, swaggerui.setup(swaggerSpec));
app.use("/api/auth", authRoutes);
app.use("/api/url", urlRoutes);
app.use("/api/analytics", analyticsRoutes);

app.use(errorHandler);

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT} 👽`);

  try {
    await connectRedis();

    await AppDataSource.initialize();
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Error during initialization:", error);
    process.exit(1);
  }
});
