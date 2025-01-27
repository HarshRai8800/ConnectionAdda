import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export const verify = (req: any, res: any, next: NextFunction) => {
  try {
    const token = req.cookies?.jwt;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: Token not provided" });
    }

    const secretKey = process.env.JWT_KEY || "jwtSecret";

    const data = jwt.verify(token, secretKey) as JwtPayload;

    if (!data || typeof data !== "object" || !data.userId) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    // Attach the userId to the request object
    (req as any).userId = data.userId;

    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(401).json({ message: "Unauthorized: Token verification failed" });
  }
};

declare module "express" {
    export interface Request {
      userId?: string;
    }
  }
  