import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { authRoutes } from "./routes/auth.ts";

const app = new Hono();

app.get("/api/health", (c) => {
  return c.json({ ok: true });
});

app.route("/api/auth", authRoutes);

serve({ fetch: app.fetch, port: 3000 }, (info) => {
  console.log(`サーバーが起動しました: http://localhost:${info.port}`);
});
