import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface CustomJwtPayload extends JwtPayload {
  userId: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload | { userId: string; email: string };
    }
  }
}
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Authentication required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

   if (!decoded.userId || !decoded.email) {
     return res
       .status(401)
       .json({ success: false, message: "Invalid token structure" });
   }

   
   req.user = decoded;
   next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Authentication failed" });
  }
};
