import { DataSource } from "typeorm";
import { User } from "../entities/User";
import { config } from "dotenv";
config();
export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  synchronize: true,
  logging: true,
  entities:[User]
});
