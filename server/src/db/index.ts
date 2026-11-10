import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema.ts";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

// つなぎが切れたときの知らせを受け取る。ここがないとサーバーごと落ちる
pool.on("error", (err) => {
  console.error("DB とのつなぎが切れました", err);
});

export const db = drizzle({
  client: pool,
  schema,
  casing: "snake_case",
});
