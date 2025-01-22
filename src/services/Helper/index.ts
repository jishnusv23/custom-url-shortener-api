import { Analytics } from "../../entities";

export class HelperMethods {
  

  /**
   * Get clicks by date (recent N days)
   * @param analyticData - Array of Analytics data
   * @param days - Number of recent days to consider
   */
  getClicksByDate(
    analyticData: Analytics[],
    days: number = 7
  ): { date: string; clickCount: number }[] {
    const today = new Date();
    const lastNDays = Array.from({ length: days }, (_, i) => {
      const date = new Date();
      date.setDate(today.getDate() - i);
      return date.toISOString().split("T")[0];
    });

    return lastNDays.map((date) => {
      const clickCount = analyticData.filter((data) =>
        data.timestamp.toISOString().startsWith(date)
      ).length;

      return { date, clickCount };
    });
  }

  /**
   * Get OS type analytics (unique clicks and users per OS)
   */
  getOsType(
    analyticData: Analytics[]
  ): { osName: string; uniqueClicks: number; uniqueUsers: number }[] {
    const osMap = new Map<
      string,
      { uniqueClicks: number; uniqueUsers: Set<string> }
    >();

    analyticData.forEach((data) => {
      const osName = data.os;
      if (!osMap.has(osName)) {
        osMap.set(osName, { uniqueClicks: 0, uniqueUsers: new Set() });
      }
      const osStats = osMap.get(osName)!;
      osStats.uniqueClicks += 1;
      osStats.uniqueUsers.add(data.userId);
    });

    return Array.from(osMap.entries()).map(([osName, stats]) => ({
      osName,
      uniqueClicks: stats.uniqueClicks,
      uniqueUsers: stats.uniqueUsers.size,
    }));
  }

  /**
   * Get device type analytics (unique clicks and users per device)
   */
  getDeviceType(
    analyticData: Analytics[]
  ): { deviceName: string; uniqueClicks: number; uniqueUsers: number }[] {
    const deviceMap = new Map<
      string,
      { uniqueClicks: number; uniqueUsers: Set<string> }
    >();

    analyticData.forEach((data) => {
      const deviceName = data.device;
      if (!deviceMap.has(deviceName)) {
        deviceMap.set(deviceName, { uniqueClicks: 0, uniqueUsers: new Set() });
      }
      const deviceStats = deviceMap.get(deviceName)!;
      deviceStats.uniqueClicks += 1;
      deviceStats.uniqueUsers.add(data.userId);
    });

    return Array.from(deviceMap.entries()).map(([deviceName, stats]) => ({
      deviceName,
      uniqueClicks: stats.uniqueClicks,
      uniqueUsers: stats.uniqueUsers.size,
    }));
  }
}
