import { randomBytes, randomUUID } from "node:crypto";
import { demoRecords } from "../db/demo-data.ts";
import { hashPassword } from "../lib/password.ts";
import { createSessionId } from "../lib/session.ts";
import { findAllOptions } from "../options/repository.ts";
import { createRecord } from "../records/repository.ts";
import { createSession } from "./sessions.ts";
import { createUser, deleteOldDemoUsers } from "./users.ts";

const DEMO_HOURS = 24;
const HOUR = 60 * 60 * 1000;

export async function startDemo() {
  const now = Date.now();

  // 24時間たったお試し用アカウントを消す（記録とセッションも一緒に消える）
  await deleteOldDemoUsers(new Date(now - DEMO_HOURS * HOUR));

  // メールアドレスとパスワードは自動で作る。本人には見せない
  const user = await createUser({
    email: `demo-${randomUUID()}@example.invalid`,
    passwordHash: await hashPassword(randomBytes(32).toString("base64url")),
    name: "お試しユーザー",
    isDemo: true,
  });

  await copyDemoRecords(user.id, now);

  const session = await createSession({
    id: createSessionId(),
    userId: user.id,
    expireAt: new Date(now + DEMO_HOURS * HOUR),
  });

  return {
    sessionId: session.id,
    expireAt: session.expireAt,
    user: { id: user.id, email: user.email, name: user.name },
  };
}

async function copyDemoRecords(userId: number, now: number) {
  const options = await findAllOptions();

  // 選択肢の名前から番号を探す
  function idOf(rows: { id: number; name: string }[], name: string) {
    const row = rows.find((r) => r.name === name);
    if (!row) {
      throw new Error(`選択肢が見つかりません: ${name}`);
    }
    return row.id;
  }

  for (const demo of demoRecords) {
    const {
      daysAgo,
      origin,
      process,
      roastLevel,
      varieties,
      flavors,
      ...fields
    } = demo;
    await createRecord(userId, {
      ...fields,
      drankOn: new Date(now - daysAgo * 24 * HOUR).toISOString().slice(0, 10),
      originId: origin ? idOf(options.origins, origin) : undefined,
      processId: process ? idOf(options.processes, process) : undefined,
      roastLevelId: roastLevel
        ? idOf(options.roastLevels, roastLevel)
        : undefined,
      varietyIds: varieties.map((name) => idOf(options.varieties, name)),
      flavorIds: flavors.map((name) => idOf(options.flavors, name)),
    });
  }
}
