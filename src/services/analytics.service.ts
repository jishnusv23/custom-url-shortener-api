import { AppDataSource } from "../config/database";
import { Analytics, ShortUrls, User } from "../entities";
import { UAParser } from "ua-parser-js";
import { DeviceTypeAnalytics, OsTypeAnalytics, UrlTopics, VisitData } from "../utils/Type";
import geoip from "geoip-lite";


import ErrorResponse from "../utils/common/errorResponse";
import { HelperMethods } from "./Helper";


export class AnalyticsServices {
  private analyticsRepository = AppDataSource.getRepository(Analytics);
  private shortUrlRepository = AppDataSource.getRepository(ShortUrls);
  private helperMethods: HelperMethods;
  constructor() {
    this.helperMethods = new HelperMethods(AppDataSource);
  }
  async createanalystics(visitData: VisitData) {
  
    const parse = new UAParser(visitData.userAgent);
    // const os = parse.getOS();
    // const device = parse.getDevice();


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
   
    await this.analyticsRepository.save(analytics);
    return analytics;
  }

  async getAnalyticsByAlias(alias: string) {
    try {
      const Url = await this.shortUrlRepository.findOne({
        where: { alias: alias },
      });
      
      if (!Url) {
        throw ErrorResponse.notFound("alias not found ");
      }

      const analyticData = await this.analyticsRepository.find({
        where: { shortUrlId: Url.id },
      });

      
      const { totalClicks, uniqueUsers } = await this.helperMethods.totalStats(
        Url.id
      );
      // console.log("🚀 ~ file: analytics.service.ts:78 ~ AnalyticsServices ~ getAnalyticsByAlias ~ clicks:", totalStats)
      const clicksByDate = await this.helperMethods.clicksByDate(Url.id);
      const osTypeAnalytics = await this.helperMethods.osTypeAnalytics(Url.id);
      const deviceTypeAnalytics = await this.helperMethods.deviceTypeAnalytics(
        Url.id
      );
      

      return {
        alias,
        originalUrl: Url.longUrl,
        totalClicks,
        uniqueUsers,
        clicksByDate,
        osTypeAnalytics,
        deviceTypeAnalytics,

        analytics: analyticData,
      };
    } catch (error: any) {
      console.error("something went wrong in getanalytics", error);

      throw ErrorResponse.internalError(
        "Internal Server error please try later "
      );
    }
  }
  async TopicBasedAnalytics(topic: string) {
    try {
      if (!Object.values(UrlTopics).includes(topic as UrlTopics)) {
        throw ErrorResponse.notFound("Invalid topic provided");
      }

      const Urls = await this.shortUrlRepository.find({
        where: { topic: topic as UrlTopics },
      });
      // console.log("🚀 ~ file: analytics.service.ts:113 ~ AnalyticsServices ~ TopicBasedAnalytics ~ Urls:", Urls)
    
      const urlAnalytics = await Promise.all(
        Urls.map(async (url) => {
          const { totalClicks, uniqueUsers } =
            await this.helperMethods.totalStats(url.id);
          const clicksByDate = await this.helperMethods.clicksByDate(url.id);

          return {
            shortUrl: url.alias,
            totalClicks,
            uniqueUsers,
            clicksByDate,
          };
        })
      );

      const allShortUrlIds = Urls.map((url) => url.id);

      const aggregatedUrlsData = await this.helperMethods.urlsAnalytics(
        allShortUrlIds
      );

      const totalClicks = urlAnalytics.reduce(
        (sum, url) => sum + url.totalClicks,
        0
      );
      const uniqueUsers = urlAnalytics.reduce(
        (sum, url) => sum + url.uniqueUsers,
        0
      );

      const clicksByDateMap = new Map<string, number>();

      urlAnalytics.forEach((url) => {
        url.clicksByDate.forEach(({ date, clicks }) => {
          clicksByDateMap.set(date, (clicksByDateMap.get(date) || 0) + clicks);
        });
      });

      const aggregatedClicksByDate = Array.from(clicksByDateMap.entries()).map(
        ([date, clicks]) => ({ date, clicks })
      );

      return {
        totalClicks,
        uniqueUsers,
        clicksByDate: aggregatedClicksByDate,
        aggregatedUrlsData,
      };
    } catch (error) {
      console.error("Error in TopicBasedAnalytics:", error);

      throw error;
    }
  }

  async OverallAnalytics(userId: string) {
    try {
      const Urls = await this.shortUrlRepository.find({
        where: { userId },
      });
      console.log(Urls, "data from url");

      // Get the total number of URLs
      const totalUrls = await this.helperMethods.totalUrsl(userId);

      // Aggregate analytics for each URL
      const urlAnalytics = await Promise.all(
        Urls.map(async (url) => {
          const { totalClicks, uniqueUsers } =
            await this.helperMethods.totalStats(url.id);
          const clicksByDate = await this.helperMethods.clicksByDate(url.id);
          const osTypeAnalytics = await this.helperMethods.osTypeAnalytics(
            url.id
          );
          const deviceTypeAnalytics =
            await this.helperMethods.deviceTypeAnalytics(url.id);

          return {
            shortUrl: url.alias,
            totalClicks,
            uniqueUsers,
            clicksByDate,
            osTypeAnalytics,
            deviceTypeAnalytics,
          };
        })
      );

      const totalClicks = urlAnalytics.reduce(
        (sum, url) => sum + url.totalClicks,
        0
      );
      const totalUniqueUsers = urlAnalytics.reduce(
        (sum, url) => sum + url.uniqueUsers,
        0
      );

      const clicksByDateMap = new Map<string, number>();

      urlAnalytics.forEach((url) => {
        url.clicksByDate.forEach(({ date, clicks }) => {
          clicksByDateMap.set(date, (clicksByDateMap.get(date) || 0) + clicks);
        });
      });

      const aggregatedClicksByDate = Array.from(clicksByDateMap.entries()).map(
        ([date, clicks]) => ({ date, clicks })
      );


      const aggregatedOsTypeAnalytics = urlAnalytics.reduce<OsTypeAnalytics>(
        (acc, url) => {
          url.osTypeAnalytics.forEach(
            ({ osName, uniqueClicks, uniqueUsers }) => {
              if (!acc[osName]) {
                acc[osName] = { uniqueClicks: 0, uniqueUsers: 0 };
              }
              acc[osName].uniqueClicks += uniqueClicks;
              acc[osName].uniqueUsers += uniqueUsers;
            }
          );
          return acc;
        },
        {}
      );

     
      const aggregatedDeviceTypeAnalytics =
        urlAnalytics.reduce<DeviceTypeAnalytics>((acc, url) => {
          url.deviceTypeAnalytics.forEach(
            ({ deviceName, uniqueClicks, uniqueUsers }) => {
              if (!acc[deviceName]) {
                acc[deviceName] = { uniqueClicks: 0, uniqueUsers: 0 };
              }
              acc[deviceName].uniqueClicks += uniqueClicks;
              acc[deviceName].uniqueUsers += uniqueUsers;
            }
          );
          return acc;
        }, {});

      // Return the final aggregated data
      return {
        totalUrls,
        totalClicks,
        totalUniqueUsers,
        clicksByDate: aggregatedClicksByDate,
        osTypeAnalytics: aggregatedOsTypeAnalytics,
        deviceTypeAnalytics: aggregatedDeviceTypeAnalytics,
      };
    } catch (error) {
      console.error("Something went wrong in overallAnalytics", error);
      throw ErrorResponse.internalError("Error fetching overall analytics");
    }
  }
}
