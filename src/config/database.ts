import { DataSource } from "typeorm";
import { User,ShortUrls, Analytics } from "../entities";
import { config } from "dotenv";
config();
export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  synchronize: true,
  logging: true,
  entities: [User, ShortUrls,Analytics],
  ssl: {
    rejectUnauthorized: false,
  },
});
