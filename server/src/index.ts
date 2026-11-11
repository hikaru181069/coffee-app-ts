import { serve } from "@hono/node-server";
import { app } from "./app.ts";

serve({ fetch: app.fetch, port: 3000 }, (info) => {
  console.log(`サーバーが起動しました: http://localhost:${info.port}`);
});
