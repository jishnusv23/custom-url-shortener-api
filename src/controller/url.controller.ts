import express, { Request, Response, NextFunction } from "express";
import { UrlServices } from "../services/url.service";
import ErrorResponse from "../utils/common/errorResponse";
import { StatusCode } from "../utils/common/HttpStatusCode ";
import { ShortUrls, User } from "../entities";
import { AnalyticsServices } from "../services/analytics.service";
import { VisitData } from "../utils/Type";
import { ObjectId } from "typeorm";

export class UrlController {
  private urlservices!: UrlServices;
   private analyticasservices!:AnalyticsServices
  constructor() {
    this.urlservices = new UrlServices();
    this.analyticasservices=new AnalyticsServices()
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

      // console.log("🚀 ~ file: url.controller.ts:28 ~ UrlController ~ createShorturl= ~ url:", url)
      res.status(StatusCode.CREATED).json({
        shortUrl: `${process.env.BASE_URL}/${url.alias}`,
        originalUrl: url.longUrl,
        createdAt: url.createdAt,
        topic: url.topic || undefined,
      });
      return;
    } catch (error: any) {
      if (error.message === "Invalid URL provided") {
        res.status(StatusCode.BAD_REQUEST).json({ error: error.message });
      }
      if (error.message === " alias already taken") {
        res.status(StatusCode.CONFLICT).json({ error: error.message });
      }
      next(error);
    }
  };

  redirectUrl = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // console.log(req.params, "params");
      const { alias } = req.params;
      if (!alias) throw ErrorResponse.badRequest("alias is missing ");

      const url = await this.urlservices.getAndTrackUrl(alias) as ShortUrls

      console.log("🚀 ~ file: url.controller.ts:54 ~ UrlController ~ redirectUrl= ~ url:", url)

      if (!url.longUrl) {
        throw ErrorResponse.notFound("URL not found");
      }
       const params: VisitData = {
         shortUrl_id: url.id,
         userAgent: req.headers["user-agent"] as string,
         ipAddress: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
         timestamp: new Date(),
         userId: url.userId.toString(),
       };
       
       await this.analyticasservices.createanalystics(params);
      res.redirect(url.longUrl);
      // res.status(200).json({data:url})
    } catch (error) {
      next(error)
    }
  };
}
