import { defineConfig } from "vitest/config";

process.loadEnvFile(".env.test");

export default defineConfig({
  test: {
    include: ["test/**/*.test.ts"],
    // テストの前に1回だけ、テスト用の DB に表と選択肢を入れる
    globalSetup: "./test/global-setup.ts",
    // どのテストも同じ DB を使うので、ファイルを1つずつ順番に動かす
    fileParallelism: false,
  },
});
