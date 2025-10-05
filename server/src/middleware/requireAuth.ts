// server/src/middleware/requireAuth.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const hdr = req.headers.authorization;
  const token = hdr?.startsWith("Bearer ") ? hdr.slice(7) : undefined;
  if (!token) return res.status(401).json({ message: "Missing token" });

  try {
    const payload = jwt.verify(token, env.jwtAccessSecret) as {
      _id: string;
      role: "citizen" | "clerk" | "admin";
    };
    req.user = payload; // ✅ now typed
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
}
