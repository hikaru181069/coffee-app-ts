import { asc } from "drizzle-orm";
import { db } from "../db/index.ts";
import {
  origins,
  varieties,
  processes,
  roastLevels,
  flavors,
} from "../db/schema.ts";

export async function findAllOptions() {
  const [originRows, varietyRows, processRows, roastLevelRows, flavorRows] =
    await Promise.all([
      db.select().from(origins).orderBy(asc(origins.id)),
      db.select().from(varieties).orderBy(asc(varieties.id)),
      db.select().from(processes).orderBy(asc(processes.id)),
      db.select().from(roastLevels).orderBy(asc(roastLevels.sortOrder)),
      db.select().from(flavors).orderBy(asc(flavors.id)),
    ]);

  return {
    origins: originRows,
    varieties: varietyRows,
    processes: processRows,
    roastLevels: roastLevelRows,
    flavors: flavorRows,
  };
}
