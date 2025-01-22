import { Request, Response, NextFunction } from "express";

import { AnalyticsServices } from "../services/analytics.service";
import ErrorResponse from "../utils/common/errorResponse";
import { StatusCode } from "../utils/common/HttpStatusCode ";

export class AnalyticsCotroller {
  private analyticasservices!: AnalyticsServices;
  constructor() {
    this.analyticasservices = new AnalyticsServices();
  }

  getAnalytics=async(req:Request,res:Response,next:NextFunction)=>{
    try{
      console.log(req.params)
      const { alias }=req.params
      if(!alias) throw ErrorResponse.badRequest('Check your params')
        const analyticData=await this.analyticasservices.getAnalyticsByAlias(alias)
      res.status(StatusCode.OK).json({success:true,data:analyticData})
    }catch(error){
      next(error)
    }
  }
}
