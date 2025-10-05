import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { env } from "./config/env";
import { connectDB } from "./config/db";
import authRoutes from "./routes/auth";
import applicationRoutes from "./routes/applications";
import healthRoute from "./routes/health";
import { errorHandler } from "./middleware/errorHandler";

async function bootstrap() {
  await connectDB();
  const app = express();
  const staticAllow = new Set([
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://buergerportal-projekt-client.vercel.app", // no trailing slash
  ]);
  const vercelPreview = /^https:\/\/[a-z0-9-]+\.vercel\.app$/i;

  app.use(helmet());
  app.use(
    cors({
      origin(origin, cb) {
        if (!origin) return cb(null, true); // allow curl/postman
        if (staticAllow.has(origin) || vercelPreview.test(origin)) {
          return cb(null, true);
        }
        return cb(new Error(`CORS: Origin not allowed: ${origin}`));
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      optionsSuccessStatus: 204,
    })
  );
  app.use(express.json({ limit: "2mb" }));
  app.use(cookieParser());
  app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }));

  app.use("/api", healthRoute);
  app.use("/api/auth", authRoutes);
  app.use("/api/applications", applicationRoutes);

  app.use(errorHandler);

  app.listen(env.port, () => {
    console.log(`API listening on http://localhost:${env.port}`);
  });
}

bootstrap().catch((e) => {
  console.error("Failed to start server", e);
  process.exit(1);
});
