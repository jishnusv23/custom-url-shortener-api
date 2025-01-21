import express, { Request, Response, NextFunction } from "express";
import { UrlServices } from "../services/url.service";

export class UrlController {
  private urlservices!: UrlServices;
  constructor() {
    this.urlservices = new UrlServices();
  }
  createShorturl = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log(req.body,'url body')
        
    } catch (error) {



    }
  };
}
