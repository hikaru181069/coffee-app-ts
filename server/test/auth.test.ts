import { beforeEach, describe, expect, test } from "vitest";
import { loginAsNewUser, request, resetDb } from "./helpers.ts";

describe("ログイン", () => {
  beforeEach(async () => {
    await resetDb();
  });

  test("ログインしていないと、記録を見ることも作ることもできない", async () => {
    const list = await request("GET", "/api/records");
    expect(list.status).toBe(401);

    const create = await request("POST", "/api/records", {
      body: {
        name: "エチオピア",
        drankOn: "2026-11-10",
        place: "home",
        varietyIds: [],
        flavorIds: [],
      },
    });
    expect(create.status).toBe(401);
  });

  test("パスワードを変えたら、前の cookie は使えない", async () => {
    const cookie = await loginAsNewUser("alice@example.com");

    const change = await request("PATCH", "/api/auth/password", {
      cookie,
      body: { currentPassword: "password123", newPassword: "newpassword456" },
    });
    expect(change.status).toBe(204);

    // 前の cookie では、もう使えない
    const me = await request("GET", "/api/auth/me", { cookie });
    expect(me.status).toBe(401);

    // 新しいパスワードなら、ログインできる
    const login = await request("POST", "/api/auth/login", {
      body: { email: "alice@example.com", password: "newpassword456" },
    });
    expect(login.status).toBe(200);
  });
});

describe("デモアカウント", () => {
  beforeEach(async () => {
    await resetDb();
  });

  test("デモで使うと、ログインした状態になり、サンプル記録が7つ入っている", async () => {
    const demo = await request("POST", "/api/auth/demo");
    expect(demo.status).toBe(201);

    const cookie = (demo.headers.get("Set-Cookie") ?? "").split(";")[0];

    const records = await request("GET", "/api/records", { cookie });
    expect(records.status).toBe(200);
    expect(await records.json()).toHaveLength(7);

    // デモアカウントでは、パスワードを変えられない
    const change = await request("PATCH", "/api/auth/password", {
      cookie,
      body: { currentPassword: "password123", newPassword: "newpassword456" },
    });
    expect(change.status).toBe(403);
  });
});
