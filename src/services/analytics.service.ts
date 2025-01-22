import { AppDataSource } from "../config/database";
import { Analytics, ShortUrls, User } from "../entities";
import { UAParser } from "ua-parser-js";
import { VisitData } from "../utils/Type";
import geoip from "geoip-lite";

import ErrorResponse from "../utils/common/errorResponse";
import { HelperMethods } from "./Helper";

export class AnalyticsServices {
  private analyticsRepository = AppDataSource.getRepository(Analytics);
  private shortUrlRepository = AppDataSource.getRepository(ShortUrls);
  private helperMethods: HelperMethods
  constructor(){
    this.helperMethods=new HelperMethods()
  }
  async createanalystics(visitData: VisitData) {
    console.log(visitData,'visitdata')
    const parse = new UAParser(visitData.userAgent);
const os = parse.getOS(); // Returns { name: 'Windows', version: '10' }
const device = parse.getDevice(); // Returns { vendor: 'Dell', model: 'XPS', type: 'desktop' }

console.log("OS:", os.name, os.version);
console.log("Device:", device.vendor, device.model, device.type);

    const { name: osName = "Unknown" } = parse.getOS() || {};
    const { type: deviceType = "Unknown" } = parse.getDevice() || {};

 
    const geo = geoip.lookup(visitData.ipAddress);

    const analytics = this.analyticsRepository.create({
      userAgent: visitData.userAgent,
      os: osName,
      device: deviceType, 
      ipAddress: visitData.ipAddress,
      shortUrlId: visitData.shortUrl_id,
      userId: visitData.userId,
      user: { id: visitData.userId } as User,
      shortUrl: { id: visitData.shortUrl_id } as ShortUrls,
    });
    console.log("🚀 ~ file: analytics.service.ts:31 ~ AnalyticsServices ~ createanalystics ~ analytics:", analytics)

    await this.analyticsRepository.save(analytics);
    return analytics;
  }

  async getAnalyticsByAlias(alias: string) {
    try {
      const Url = await this.shortUrlRepository.findOne({
        where: { alias: alias },
      });
      console.log("🚀 ~ file: analytics.service.ts:38 ~ AnalyticsServices ~ getAnalyticsByAlias ~ Url:", Url)
      if (!Url) {
        throw ErrorResponse.notFound("alias not found ");
      }

      const analyticData = await this.analyticsRepository.find({where:{shortUrlId:Url.id}});
      console.log("🚀 ~ file: analytics.service.ts:45 ~ AnalyticsServices ~ getAnalyticsByAlias ~ analyticData:", analyticData)
      const totalClicks = Url.totalClick;
      const uniqueUsers = new Set(analyticData.map((data) => data.ipAddress))
        .size;
      
      const clicksByDate = this.helperMethods.getClicksByDate(analyticData);
      const osType = this.helperMethods.getOsType(analyticData);
      const deviceType = this.helperMethods.getDeviceType(analyticData);
      return {
        alias,
        originalUrl: Url.longUrl,
        totalClicks,
        uniqueUsers,
        clicksByDate,
        osType,
        deviceType,
        analytics: analyticData,
      };
    } catch (error:any) {
      console.error('something went wrong in getanalytics',error);
      
      throw ErrorResponse.internalError("Internal Server error please try later ")
    }
  }
}
