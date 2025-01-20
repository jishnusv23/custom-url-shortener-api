import "reflect-metadata";
import express, { Request, Response, Application } from "express";
import { config } from "dotenv";
import morgan from "morgan";
config();

const app: Application = express();
const PORT: Number = Number(process.env.PORT);

app.use(morgan("dev"));

app.listen(PORT, async () => {
  try {
    console.log(`Server is running on port ${PORT} 👽`);
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1);
  }
});
