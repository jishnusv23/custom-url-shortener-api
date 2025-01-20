import express, { Request, Response, NextFunction } from "express";
import { clearScreenDown } from "readline";
import { AuthServices } from "../services/auth.service";

export class AuthController {
  private authService!: AuthServices;
  constructor() {
    const authService = new AuthServices();
  }

  googleAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
      //   console.log(req.headers, "headres");
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer")) {
        res.status(401).json({
          success: false,
          message: "Authorization header is missing ",
        });
      }
      const id_toke = authHeader?.split(" ")[1];
      //   console.log(
      //     "🚀 ~ file: auth.controller.ts:21 ~ AuthController ~ googleAuth= ~ id_toke:",
      //     id_toke
      //   );
      if (!id_toke) {
        res
          .status(401)
          .json({ success: false, message: "Invalid token format " });
      }
      const authData = await this.authService.authenticateGoogle(id_toke as string)
    } catch (error) {
      next(error);
    }
  };
}
