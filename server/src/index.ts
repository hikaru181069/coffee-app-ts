import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { authRoutes } from "./auth/routes.ts";
import { optionsRoutes } from "./options/routes.ts";
import { recordsRoutes } from "./records/routes.ts";

const app = new Hono();

app.get("/api/health", (c) => {
  return c.json({ ok: true });
});

app.route("/api/auth", authRoutes);
app.route("/api/options", optionsRoutes);
app.route("/api/records", recordsRoutes);

app.notFound((c) => {
  return c.json(
    { error: { code: "not_found", message: "見つかりません" } },
    404,
  );
});

app.onError((err, c) => {
  if (err instanceof HTTPException && err.status === 400) {
    return c.json(
      {
        error: {
          code: "invalid_json",
          message: "送られてきたjsonが壊れてるンゴ",
        },
      },
      400,
    );
  }
  console.error(err);
  return c.json(
    {
      error: {
        code: "internal_error",
        message: "サーバーでエラーが起きたンゴ",
      },
    },
    500,
  );
});

serve({ fetch: app.fetch, port: 3000 }, (info) => {
  console.log(`サーバーが起動しました: http://localhost:${info.port}`);
});
