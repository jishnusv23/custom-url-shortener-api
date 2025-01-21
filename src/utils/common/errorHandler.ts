import { Request, Response, NextFunction } from "express";
import ErrorResponse from "./errorResponse";
import { StatusCode } from "./HttpStatusCode ";

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ErrorResponse) {
    res
      .status(err.status)
      .json({ success: false, message: err.message, status: err.status });
  }

  res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ success: false ,status:StatusCode.INTERNAL_SERVER_ERROR,message:"Internal Server Error"});
};


export default errorHandler