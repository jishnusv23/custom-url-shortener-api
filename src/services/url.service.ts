import { AppDataSource } from "../config/database";
import { ShortUrls, User } from "../entities";
// import { nanoid } from "nanoid";
import { uid } from "rand-token";
import ErrorResponse from "../utils/common/errorResponse";
import { Equal } from "typeorm";
import { UrlTopics } from "../utils/Type";
import { redisClient } from "../config/redis";
export class UrlServices {
  private urlRepository = AppDataSource.getRepository(ShortUrls);

  generateShortUrl() {
    return uid(8);
  }

  async createShortUrl(data: {
    longUrl: string;
    userId: string;
    customAlias?: string;
    topic?: string;
  }) {
    console.log("data", data);
    try {
      //validate the url
      new URL(data.longUrl);
    } catch (err) {
      throw ErrorResponse.badRequest("Invalid URl Provided");
    }
    if (data.customAlias) {
      const exsistingAlias = await this.urlRepository.findOne({
        where: { alias: data.customAlias },
      });
      console.log(
        "🚀 ~ file: url.service.ts:33 ~ UrlServices ~ exsistingAlias:",
        exsistingAlias
      );
      if (exsistingAlias) {
        throw ErrorResponse.conflict("alias already taken");
      }
    }
    // check the url exists
    const exsistingUrl = await this.urlRepository.findOne({
      where: { longUrl: data.longUrl, userId: Equal(data.userId) },
    });
    console.log(
      "🚀 ~ file: url.service.ts:42 ~ UrlServices ~ exsistingUrl:",
      exsistingUrl
    );
    if (exsistingUrl) {
      return exsistingUrl;
    }
    //create new
    const alias = data.customAlias || this.generateShortUrl();
    const topic = Object.values(UrlTopics).includes(data.topic as UrlTopics)
      ? (data.topic as UrlTopics)
      : UrlTopics.OTHER;

    const url = this.urlRepository.create({
      longUrl: data.longUrl,
      alias,
      userId: { id: data.userId } as User,
      topic,
    });
    console.log("🚀 ~ file: url.service.ts:55 ~ UrlServices ~ url:", url);

    await this.urlRepository.save(url);
    return url;
  }

  async getAndTrackUrl(alias: string) {
   try{

     console.log(alias, "alias");
     const cachedUrl = await redisClient.get(`url:${alias}`);
     if (cachedUrl) return cachedUrl;

     const url = await this.urlRepository.findOne({ where: { alias } });
     if (url) {
       await redisClient.setEx(`url:${alias}`, 3600, url.longUrl);
       url.totalClick += 1;
       await this.urlRepository.save(url);
       return url.longUrl;
     }
     return null
   }catch(err:any){
    console.error('redirectulrservice showing ',err);
    throw ErrorResponse.internalError(err.message|| "Internal Error")
    
   }
  }
}
