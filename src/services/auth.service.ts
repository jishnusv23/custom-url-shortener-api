import { OAuth2Client } from "google-auth-library";
import { config } from "dotenv";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../config/database";
import { User } from "../entities/User";

config();

export class AuthServices {
  private client: OAuth2Client;
  private userRepository = AppDataSource.getRepository(User);

  constructor() {
    this.client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

  async verifyGoogleToken(token: string): Promise<any> {
    try {
      console.log(token, "token");
      const ticket = await this.client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      return ticket.getPayload();
    } catch (error) {
      console.error("Error verifying Google token:", error);
      throw new Error("Invalid Google token");
    }
  }
  generateJWT(user: User) {
    return jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "24h" }
    );
  }

  async authenticateGoogle(idToken: string):Promise<{user:User,token:string}> {
    try {
      const payload = await this.verifyGoogleToken(idToken);
      console.log("🚀 ~ AuthServices ~ authenticateGoogle ~ payload:", payload);

      if (!payload) throw new Error("Invalid Token Payload");

      let user = await this.userRepository.findOne({
        where: { googleId: payload.sub },
      });
      if (!user) {
        user = this.userRepository.create({
          googleId: payload.sub,
          email: payload.email,
        });
      }
      await this.userRepository.save(user);
      const token = this.generateJWT(user);
      return { user, token };
    } catch (error) {
      console.error("Error during Google authentication:", error);
      throw error;
    }
  }
}
