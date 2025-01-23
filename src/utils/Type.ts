import { ShortUrls, User } from "../entities";
import { ObjectId } from "typeorm";

export enum UrlTopics {
  
  ACQUISITION = "acquisition",
  ACTIVATION = "activation",
  RETENTION = "retention",
  OTHER = "other",
}


export interface VisitData {
  shortUrl_id: string;
  userAgent: string;
  ipAddress: any;
  timestamp: Date;
  userId: string;
  device?: string;
  os?: string;
}
export interface OsTypeAnalytics {
  [osName: string]: {
    uniqueClicks: number;
    uniqueUsers: number;
  };
}

 export interface DeviceTypeAnalytics {
  [deviceName: string]: {
    uniqueClicks: number;
    uniqueUsers: number;
  };
}