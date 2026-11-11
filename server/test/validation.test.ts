import { describe, expect, test } from "vitest";
import { recordInputSchema } from "../src/records/validation.ts";

// B. 関数だけを確かめるテスト（DB もサーバーも使わない）
describe("記録の入力の決まり", () => {
  const valid = {
    name: "エチオピア",
    drankOn: "2026-11-10",
    place: "home",
    varietyIds: [],
    flavorIds: [],
  };

  test("正しい記録は通る", () => {
    expect(recordInputSchema.safeParse(valid).success).toBe(true);
  });

  test("評価が 11 だと通らない", () => {
    const result = recordInputSchema.safeParse({ ...valid, rating: 11 });
    expect(result.success).toBe(false);
  });
});
