import { execSync } from "node:child_process";

export default function setup() {
  // 表を作る（drizzle/ にあるマイグレーションを流す）
  execSync("npx drizzle-kit migrate", { stdio: "inherit" });
  // 選択肢を入れる（すでにあれば何もしない）
  execSync("npx tsx src/db/seed.ts", { stdio: "inherit" });
}
