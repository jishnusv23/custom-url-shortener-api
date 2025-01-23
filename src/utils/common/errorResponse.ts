import { StatusCode } from "./HttpStatusCode ";

export default class ErrorResponse extends Error {
  public status: number;
  public message: string;
  public success: boolean;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.message = message;
    this.success = false;
  }

  static badRequest(msg: string): ErrorResponse {
    return new ErrorResponse(StatusCode.BAD_REQUEST, msg || "Bad Request");
  }

  static unauthorized(msg: string): ErrorResponse {
    return new ErrorResponse(StatusCode.UNAUTHORIZED, msg || "Unauthorized");
  }

  static forbidden(msg: string): ErrorResponse {
    return new ErrorResponse(StatusCode.FORBIDDEN, msg || "Forbidden");
  }

  static notFound(msg: string): ErrorResponse {
 
    throw new ErrorResponse(StatusCode.NOT_FOUND, msg || "Not Found");
  }
  static conflict(msg: string): ErrorResponse {
    return new ErrorResponse(StatusCode.CONFLICT, msg || "Conflict");
  }

  static internalError(msg: string): ErrorResponse {
    return new ErrorResponse(StatusCode.CONFLICT, msg || "internal Server Error");
  }
}
