import { Request, Response, NextFunction } from "express";

import { AnalyticsServices } from "../services/analytics.service";
import ErrorResponse from "../utils/common/errorResponse";
import { StatusCode } from "../utils/common/HttpStatusCode ";

export class AnalyticsCotroller {
  private analyticasservices!: AnalyticsServices;
  constructor() {
    this.analyticasservices = new AnalyticsServices();
  }

  getAnalytics = async (req: Request, res: Response, next: NextFunction) => {
    try {
 
      const { alias } = req.params;
      if (!alias) throw ErrorResponse.badRequest("Check your params");
      const analyticData = await this.analyticasservices.getAnalyticsByAlias(
        alias
      );
      res.status(StatusCode.OK).json({ success: true, data: analyticData });
    } catch (error) {
      next(error);
    }
  };
  TopicBasedAnalytics = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { topic } = req.params;
      
      if (!topic) throw ErrorResponse.notFound("Topic not found");
      const data = await this.analyticasservices.TopicBasedAnalytics(topic);
     

      res.status(StatusCode.OK).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  };
  OverallAnalytics = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw ErrorResponse.unauthorized("Invalid user please login");
      }
      const overallanalytics = await this.analyticasservices.OverallAnalytics(
        userId
      );
     
      res.status(StatusCode.OK).json({success:true,data:overallanalytics})

    } catch (error) {
      next(error);
    }
  };
}
