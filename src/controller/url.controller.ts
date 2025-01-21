import express, { Request, Response, NextFunction } from "express";
import { UrlServices } from "../services/url.service";
import ErrorResponse from "../utils/common/errorResponse";

export class UrlController {
  private urlservices!: UrlServices;
  constructor() {
    this.urlservices = new UrlServices();
  }
  createShorturl = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // console.log(req.body, "url body", req.user, "user");
      const { longUrl, customAlias, topic } = req.body;
      if (!longUrl) {
        throw ErrorResponse.badRequest("Long URL is required");
      }
      const userId = req.user?.userId;
      if (!userId) {
        throw ErrorResponse.badRequest("Authentication required");
      }

     const url = await this.urlservices.createShortUrl({
       longUrl,
       userId,
       customAlias,
       topic,
     });

      console.log("🚀 ~ file: url.controller.ts:28 ~ UrlController ~ createShorturl= ~ url:", url)
    } catch (error: any) {
      if (error.message === "Invalid URL provided") {
         res.status(400).json({ error: error.message });
      }
      if (error.message === " alias already taken") {
        res.status(409).json({ error: error.message });
      }
      next(error);
    }
  };
}
