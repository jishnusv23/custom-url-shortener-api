
import { AppDataSource } from "../config/database";
import { ShortUrls, User } from "../entities";
// import { nanoid } from "nanoid";
import { uid } from "rand-token";
import ErrorResponse from "../utils/common/errorResponse";
import { Equal } from "typeorm";
import { UrlTopics } from "../utils/Type";
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
    console.log('data',data)
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
      if (exsistingAlias) {
        throw   ErrorResponse.conflict("alias already taken");
      }
    }
    // check the url exists
    const exsistingUrl = await this.urlRepository.findOne({
      where: { longUrl: data.longUrl, userId: Equal(data.userId) },
    });
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
    console.log("🚀 ~ file: url.service.ts:55 ~ UrlServices ~ url:", url)

    await this.urlRepository.save(url)
    return url
  }
}
