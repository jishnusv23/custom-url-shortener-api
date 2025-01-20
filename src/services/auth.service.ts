import { OAuth2Client } from "google-auth-library";
import { config } from "dotenv";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../config/database";
import { User } from "../entities/User";
config();
export class AuthServices {
  private client!: OAuth2Client;

  private userRepository = AppDataSource.getRepository(User);
  constructor() {
    this.client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

  async verifyGoogleToken(token: string) {
    try {
      console.log(token, "token");
      const ticket = await this.client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      console.log(
        "🚀 ~ file: auth.service.ts:22 ~ AuthServices ~ verifyGoogleToken ~ ticket:",
        ticket.getPayload()
      );
    } catch (error) {
      throw new Error("Invalid Google token ");
    }
  }
  async authenticateGoogle(idToke: string) {
    const payload = await this.verifyGoogleToken(idToke);
    console.log("🚀 ~ file: auth.service.ts:32 ~ AuthServices ~ authenticateGoogle ~ payload:", payload)
  }
}
