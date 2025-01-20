import "reflect-metadata";
import express, { Request, Response, Application } from "express";
import { config } from "dotenv";
import morgan from "morgan";
import { AppDataSource } from "./config/database";
import authRoutes from './routes/auth.routes'
config();

const app: Application = express();
const PORT: Number = Number(process.env.PORT);

app.use(morgan("dev"));
app.use(express.json());

app.use("/api/auth", authRoutes);

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT} 👽`);
  try {
    //initialize databaes
    AppDataSource.initialize()
      .then(() => {
        console.log("Database connected successfully ");
      })
      .catch((error) => console.log("Database connection error :", error));
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1);
  }
});
