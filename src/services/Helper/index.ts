// import { DataSource } from "typeorm";
// import { Analytics } from "../../entities";
// import { In } from "typeorm";

// export class HelperMethods {
//   private dataSource: DataSource;
//   private analyticsRepository;

//   constructor(dataSource: DataSource) {
//     this.dataSource = dataSource;
//     this.analyticsRepository = this.dataSource.getRepository(Analytics);
//   }

//   async clicksByDate(
//     shortUrl_Id?: string | string[],
//     last_day: number = 7
//   ): Promise<{ date: string; clicks: number }[]> {
//     let whereCondition = {};
//     if (Array.isArray(shortUrl_Id)) {
//       whereCondition = { shortUrlId: In(shortUrl_Id) };
//     } else if (shortUrl_Id) {
//       whereCondition = { shortUrlId: shortUrl_Id };
//     }

//     try {
//       const clicksData = await this.dataSource
//         .getRepository(Analytics)
//         .createQueryBuilder("analytics")
//         .select("DATE(analytics.timestamp) AS date")
//         .addSelect("COUNT(*) AS clicks")
//         .where(whereCondition)
//         .andWhere("analytics.timestamp >= NOW() - INTERVAL :days DAY", {
//           days: last_day,
//         })
//         .groupBy("DATE(analytics.timestamp)")
//         .orderBy("DATE(analytics.timestamp)", "DESC")
//         .getRawMany();

//       return clicksData.map((data) => ({
//         date: data.date,
//         clicks: Number(data.clicks),
//       }));
//     } catch (error) {
//       console.error("Error fetching clicks by date:", error);
//       throw new Error("Error fetching clicks by date");
//     }
//   }

//   async getCompleteUrlAnalytics(shortUrlId: string) {
//     // Total Clicks and Unique Users
//     const totalStats = await this.dataSource
//       .createQueryBuilder()
//       .select("COUNT(*)", "totalClicks")
//       .addSelect('COUNT(DISTINCT "ipAddress")', "uniqueUsers")
//       .from(Analytics, "analytics")
//       .where("analytics.shortUrlId = :shortUrlId", { shortUrlId })
//       .getRawOne();

//     // Clicks by Date (Last 7 Days)
// const clicksByDate = await this.dataSource
//   .createQueryBuilder()
//   .select("DATE(timestamp)", "date")
//   .addSelect("COUNT(*)", "clicks")
//   .from(Analytics, "analytics")
//   .where("analytics.shortUrlId = :shortUrlId", { shortUrlId })
//   .andWhere("timestamp >= NOW() - INTERVAL '7 days'")
//   .groupBy("DATE(timestamp)")
//   .orderBy("date", "DESC")
//   .getRawMany();

//     // OS Type Analytics
//     const osTypeAnalytics = await this.dataSource
//       .createQueryBuilder()
//       .select("os", "osName")
//       .addSelect("COUNT(*)", "uniqueClicks")
//       .addSelect('COUNT(DISTINCT "ipAddress")', "uniqueUsers")
//       .from(Analytics, "analytics")
//       .where("analytics.shortUrlId = :shortUrlId", { shortUrlId })
//       .groupBy("os")
//       .getRawMany();

//     // Device Type Analytics
//     const deviceTypeAnalytics = await this.dataSource
//       .createQueryBuilder()
//       .select("device", "deviceName")
//       .addSelect("COUNT(*)", "uniqueClicks")
//       .addSelect('COUNT(DISTINCT "ipAddress")', "uniqueUsers")
//       .from(Analytics, "analytics")
//       .where("analytics.shortUrlId = :shortUrlId", { shortUrlId })
//       .groupBy("device")
//       .getRawMany();

//     return {
//       totalClicks: Number(totalStats.totalClicks),
//       uniqueUsers: Number(totalStats.uniqueUsers),
//       clicksByDate: clicksByDate.map((data) => ({
//         date: data.date,
//         clicks: Number(data.clicks),
//       })),
//       osType: osTypeAnalytics.map((os) => ({
//         osName: os.osName,
//         uniqueClicks: Number(os.uniqueClicks),
//         uniqueUsers: Number(os.uniqueUsers),
//       })),
//       deviceType: deviceTypeAnalytics.map((device) => ({
//         deviceName: device.deviceName,
//         uniqueClicks: Number(device.uniqueClicks),
//         uniqueUsers: Number(device.uniqueUsers),
//       })),
//     };
//   }
// }
import { DataSource, In } from "typeorm";
import { Analytics, ShortUrls } from "../../entities";
import ErrorResponse from "../../utils/common/errorResponse";

export class HelperMethods {
  private dataSource: DataSource;

  constructor(dataSource: DataSource) {
    this.dataSource = dataSource;
  }

  async totalStats(
    shortUrlId: string
  ): Promise<{ totalClicks: number; uniqueUsers: number }> {
    try {
      const result = await this.dataSource
        .createQueryBuilder()
        .select("COUNT(*)", "totalClicks")
        .addSelect('COUNT(DISTINCT "ipAddress")', "uniqueUsers")
        .from(Analytics, "analytics")
        .where("analytics.shortUrlId = :shortUrlId", { shortUrlId })
        .getRawOne();

      return {
        totalClicks: Number(result.totalClicks),
        uniqueUsers: Number(result.uniqueUsers),
      };
    } catch (error) {
      console.error("Error fetching total stats:", error);
      throw ErrorResponse.internalError("Error fetching total stats");
    }
  }

  async clicksByDate(
    shortUrlId: string,
    lastDays: number = 7
  ): Promise<{ date: string; clicks: number }[]> {
    try {
      const clicksByDate = await this.dataSource
        .createQueryBuilder()
        .select("DATE(timestamp)", "date")
        .addSelect("COUNT(*)", "clicks")
        .from(Analytics, "analytics")
        .where("analytics.shortUrlId = :shortUrlId", { shortUrlId })
        .andWhere("timestamp >= NOW() - INTERVAL '7 days'")
        .groupBy("DATE(timestamp)")
        .orderBy("date", "DESC")
        .getRawMany();

      return clicksByDate.map((data) => ({
        date: data.date,
        clicks: Number(data.clicks),
      }));
    } catch (error) {
      console.error("Error fetching clicks by date:", error);
      throw ErrorResponse.internalError("Error fetching clicks by date");
    }
  }

  async osTypeAnalytics(
    shortUrlId: string
  ): Promise<{ osName: string; uniqueClicks: number; uniqueUsers: number }[]> {
    try {
      const osData = await this.dataSource
        .createQueryBuilder()
        .select("os", "osName")
        .addSelect("COUNT(*)", "uniqueClicks")
        .addSelect('COUNT(DISTINCT "ipAddress")', "uniqueUsers")
        .from(Analytics, "analytics")
        .where("analytics.shortUrlId = :shortUrlId", { shortUrlId })
        .groupBy("os")
        .getRawMany();

      return osData.map((os) => ({
        osName: os.osName,
        uniqueClicks: Number(os.uniqueClicks),
        uniqueUsers: Number(os.uniqueUsers),
      }));
    } catch (error) {
      console.error("Error fetching OS type analytics:", error);
      throw ErrorResponse.internalError("Error fetching OS type analytics");
    }
  }

  async deviceTypeAnalytics(
    shortUrlId: string
  ): Promise<
    { deviceName: string; uniqueClicks: number; uniqueUsers: number }[]
  > {
    try {
      const deviceData = await this.dataSource
        .createQueryBuilder()
        .select("device", "deviceName")
        .addSelect("COUNT(*)", "uniqueClicks")
        .addSelect('COUNT(DISTINCT "ipAddress")', "uniqueUsers")
        .from(Analytics, "analytics")
        .where("analytics.shortUrlId = :shortUrlId", { shortUrlId })
        .groupBy("device")
        .getRawMany();

      return deviceData.map((device) => ({
        deviceName: device.deviceName,
        uniqueClicks: Number(device.uniqueClicks),
        uniqueUsers: Number(device.uniqueUsers),
      }));
    } catch (error) {
      console.error("Error fetching device type analytics:", error);
      throw ErrorResponse.internalError("Error fetching device type analytics");
    }
  }
  async urlsAnalytics(
    shortUrls: string[]
  ): Promise<{ shortUrl: string; totalClicks: number; uniqueUsers: number }[]> {
    try {
      const urlsData = await this.dataSource
        .createQueryBuilder()
        .select("analytics.shortUrlId", "shortUrl")
        .addSelect("COUNT(*)", "totalClicks")
        .addSelect('COUNT(DISTINCT "ipAddress")', "uniqueUsers")
        .from(Analytics, "analytics")
        .where("analytics.shortUrlId IN (:...shortUrls)", { shortUrls })
        .groupBy("analytics.shortUrlId")
        .getRawMany();

      return urlsData.map((url) => ({
        shortUrl: url.shortUrl,
        totalClicks: Number(url.totalClicks),
        uniqueUsers: Number(url.uniqueUsers),
      }));
    } catch (error) {
      console.error("Error fetching URLs analytics:", error);
      throw ErrorResponse.internalError("Error fetching URLs analytics");
    }
  }

  async totalUrsl(userId: string): Promise<number> {
    try {
      const totalUrls = await this.dataSource
        .createQueryBuilder()
        .select("COUNT(*)", "total")
        .from(ShortUrls, "urls")
        .where("urls.userId=:userId", { userId })
        .getRawOne();

      return Number(totalUrls.total);
    } catch (error) {
      console.error("error fetching total URLS ", error);
      throw ErrorResponse.internalError("Error fetching total URLs");
    }
  }
}
