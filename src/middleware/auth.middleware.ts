import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface CustomJwtPayload extends JwtPayload {
  userId: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: CustomJwtPayload;
    }
  }
}
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    console.log(req.headers.authorization, "headres");
    const token = req.headers.authorization?.split(" ")[1]
    console.log("🚀 ~ file: auth.middleware.ts:24 ~ token:", token);
    if (!token) {
      res
        .status(401)
        .json({ success: false, message: "Authentication required" });
      return;
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as CustomJwtPayload;

    if (!decoded.userId || !decoded.email) {
      res
        .status(401)
        .json({ success: false, message: "Invalid token structure" });
      return;
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Authentication failed" });
  }
};
