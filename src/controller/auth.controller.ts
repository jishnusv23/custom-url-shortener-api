import express, { Request, Response, NextFunction } from "express";

import { AuthServices } from "../services/auth.service";
import { StatusCode } from "../utils/common/HttpStatusCode ";

export class AuthController {
  private authService!: AuthServices;
  constructor() {
    this.authService = new AuthServices();
  }

  googleAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
      //   console.log(req.headers, "headres");
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer")) {
        res.status(StatusCode.UNAUTHORIZED).json({
          success: false,
          message: "Authorization header is missing ",
        });
      }
      const id_toke = authHeader?.split(" ")[1];
     
      if (!id_toke) {
        res
          .status(StatusCode.UNAUTHORIZED)
          .json({ success: false, message: "Invalid token format " });
      }
      const authData = await this.authService.authenticateGoogle(
        id_toke as string
      );

      res.setHeader("authorization", `Bearer ${authData.token}`);
      res
        .status(StatusCode.CREATED)
        .json({ success: true, data: authData, message: "Successfull" });
    } catch (error) {
      next(error);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer")) {
        res.status(StatusCode.UNAUTHORIZED).json({
          success: false,
          message: "Authorization header is missing ",
        });
      }
      res.setHeader("authorization", "Bearer");
      res
        .status(StatusCode.OK)
        .json({ success: true, data: "", message: " successfull" });
    } catch (error) {
      next(error);
    }
  };
}
