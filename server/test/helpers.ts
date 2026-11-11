import { sql } from "drizzle-orm";
import { app } from "../src/app.ts";
import { db } from "../src/db/index.ts";

// ユーザーと、ユーザーにつながるもの（記録・セッション）を全部消す。選択肢は残す
export async function resetDb() {
  await db.execute(sql`truncate users restart identity cascade`);
}

// JSON を送るリクエスト。cookie を渡すと、ログインした状態で送れる
export function request(
  method: string,
  path: string,
  options: { body?: unknown; cookie?: string } = {},
) {
  const headers: Record<string, string> = {};
  if (options.body !== undefined) {
    headers["Content-Type"] = "application/json";
  }
  if (options.cookie) {
    headers["Cookie"] = options.cookie;
  }
  return app.request(path, {
    method,
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });
}

// ユーザーを登録してログインし、ログインしたことを表す cookie を返す
export async function loginAsNewUser(email = "test@example.com") {
  const user = { email, password: "password123", name: "テスト" };
  await request("POST", "/api/auth/register", { body: user });
  const res = await request("POST", "/api/auth/login", { body: user });
  const setCookie = res.headers.get("Set-Cookie") ?? "";
  return setCookie.split(";")[0]; // "session=..." の部分だけ
}
