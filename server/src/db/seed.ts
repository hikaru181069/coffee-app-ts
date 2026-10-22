import { db } from "./index.ts";
import {
  origins,
  varieties,
  processes,
  roastLevels,
  flavors,
} from "./schema.ts";

import {
  originNames,
  varietyNames,
  processNames,
  roastLevelList,
  flavorList,
} from "./seed-data.ts";

await db
  .insert(origins)
  .values(originNames.map((name) => ({ name }))) //キーの名前と変数の名前が同じなら、省略できる。
  .onConflictDoNothing();

await db
  .insert(varieties)
  .values(varietyNames.map((name) => ({ name })))
  .onConflictDoNothing();

await db
  .insert(processes)
  .values(processNames.map((name) => ({ name })))
  .onConflictDoNothing();

await db.insert(roastLevels).values(roastLevelList).onConflictDoNothing();

await db.insert(flavors).values(flavorList).onConflictDoNothing();

console.log("選択肢を入れ終わりました");
await db.$client.end();
