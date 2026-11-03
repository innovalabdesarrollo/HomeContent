import express from "express";
import cors from "cors";
import leadsRouter from "./routes/leads.js";
import designsRouter from "./routes/designs.js";
import uploadsRouter, { UPLOADS_DIR } from "./routes/uploads.js";

/** App Express compartida por server y tests. */
export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json({ limit: "6mb" }));
  app.use("/uploads", express.static(UPLOADS_DIR));

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, service: "home-content-api" });
  });

  app.use("/api/leads", leadsRouter);
  app.use("/api/designs", designsRouter);
  app.use("/api/uploads", uploadsRouter);

  return app;
}
