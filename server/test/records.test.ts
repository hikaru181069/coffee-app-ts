import { beforeEach, describe, expect, test } from "vitest";
import { loginAsNewUser, request, resetDb } from "./helpers.ts";

// A. API を外から呼ぶテスト（テスト用の DB を使う）
describe("記録を作る", () => {
  beforeEach(async () => {
    await resetDb(); // テストごとに、まっさらな状態から始める
  });

  test("名前が空だと 400 になり、保存されない", async () => {
    const cookie = await loginAsNewUser();

    const res = await request("POST", "/api/records", {
      cookie,
      body: {
        name: "",
        drankOn: "2026-11-10",
        place: "home",
        varietyIds: [],
        flavorIds: [],
      },
    });

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error.code).toBe("validation_error");

    // 本当に保存されていないかも確かめる
    const list = await request("GET", "/api/records", { cookie });
    expect(await list.json()).toEqual([]);
  });
});

describe("他の人の記録", () => {
  beforeEach(async () => {
    await resetDb();
  });

  const record = {
    name: "エチオピア",
    drankOn: "2026-11-10",
    place: "home",
    varietyIds: [],
    flavorIds: [],
  };

  test("userId を送っても、他の人の記録として作れない", async () => {
    const alice = await loginAsNewUser("alice@example.com");
    const bob = await loginAsNewUser("bob@example.com");
    const bobUser = await (
      await request("GET", "/api/auth/me", { cookie: bob })
    ).json();

    // alice が、bob の番号を userId に入れて送る
    const res = await request("POST", "/api/records", {
      cookie: alice,
      body: { ...record, userId: bobUser.id },
    });

    expect(res.status).toBe(201);
    const created = await res.json();
    expect(created.userId).not.toBe(bobUser.id);

    // bob の一覧には入っていない
    const bobList = await request("GET", "/api/records", { cookie: bob });
    expect(await bobList.json()).toEqual([]);
  });

  test("他の人の記録は、見ることも直すことも消すこともできない", async () => {
    const alice = await loginAsNewUser("alice@example.com");
    const bob = await loginAsNewUser("bob@example.com");

    const created = await (
      await request("POST", "/api/records", { cookie: alice, body: record })
    ).json();
    const path = `/api/records/${created.id}`;

    // bob からは「ない」ことになる
    expect((await request("GET", path, { cookie: bob })).status).toBe(404);
    expect(
      (
        await request("PATCH", path, {
          cookie: bob,
          body: { name: "書きかえ" },
        })
      ).status,
    ).toBe(404);
    expect((await request("DELETE", path, { cookie: bob })).status).toBe(404);

    // alice の記録は、元のまま残っている
    const res = await request("GET", path, { cookie: alice });
    expect(res.status).toBe(200);
    expect((await res.json()).name).toBe("エチオピア");
  });
});
