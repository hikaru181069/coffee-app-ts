import { db } from "./index.ts";
import {
  origins,
  varieties,
  processes,
  roastLevels,
  flavors,
} from "./schema.ts";

import {
  originList,
  varietyList,
  processList,
  roastLevelList,
  flavorList,
} from "./seed-data.ts";

await db.insert(origins).values(originList).onConflictDoNothing();

await db.insert(varieties).values(varietyList).onConflictDoNothing();

await db.insert(processes).values(processList).onConflictDoNothing();

await db.insert(roastLevels).values(roastLevelList).onConflictDoNothing();

await db.insert(flavors).values(flavorList).onConflictDoNothing();

console.log("選択肢を入れ終わりました");
await db.$client.end();
