// server/src/middleware/requireRole.ts
import { Request, Response, NextFunction } from "express";

export const requireRole =
  (...roles: Array<"citizen" | "clerk" | "admin">) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).end();
    if (!roles.includes(req.user.role)) return res.status(403).end();
    next();
  };
