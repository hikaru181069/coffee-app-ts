import { db } from "../db/index.ts";
import { records, recordVarieties, recordFlavors } from "../db/schema.ts";
import { and, desc, eq, inArray } from "drizzle-orm";

type RecordInput = {
  name: string;
  drankOn: string;
  place: "home" | "cafe";
  rating?: number;
  notes?: string;
  cafeName?: string;
  roasterName?: string;
  originId?: number;
  farmName?: string;
  processId?: number;
  roastLevelId?: number;
  coffeeGrams?: number;
  waterMl?: number;
  brewSeconds?: number;
  varietyIds: number[];
  flavorIds: number[];
};

async function attachTags(rows: (typeof records.$inferSelect)[]) {
  if (rows.length === 0) {
    return [];
  }

  const ids = rows.map((record) => record.id);
  const [varietyRows, flavorRows] = await Promise.all([
    db
      .select()
      .from(recordVarieties)
      .where(inArray(recordVarieties.recordId, ids)),
    db.select().from(recordFlavors).where(inArray(recordFlavors.recordId, ids)),
  ]);

  return rows.map((record) => ({
    ...record,
    varietyIds: varietyRows
      .filter((row) => row.recordId === record.id)
      .map((row) => row.varietyId),
    flavorIds: flavorRows
      .filter((row) => row.recordId === record.id)
      .map((row) => row.flavorId),
  }));
}

export async function findRecords(userId: number) {
  const rows = await db
    .select()
    .from(records)
    .where(eq(records.userId, userId))
    .orderBy(desc(records.drankOn), desc(records.createdAt));
  return attachTags(rows);
}

export async function findRecordById(userId: number, id: number) {
  const rows = await db
    .select()
    .from(records)
    .where(and(eq(records.id, id), eq(records.userId, userId)));
  const [record] = await attachTags(rows);
  return record;
}

export async function createRecord(userId: number, input: RecordInput) {
  // オブジェクトの分割代入と残余構文
  const { varietyIds, flavorIds, ...fields } = input;

  // transactionは複数のデータベース操作を一つの処理対象として扱う仕組み
  return db.transaction(async (tx) => {
    const rows = await tx
      .insert(records)
      .values({ ...fields, userId })
      .returning();
    const record = rows[0];

    if (varietyIds.length > 0) {
      await tx
        .insert(recordVarieties)
        .values(
          varietyIds.map((varietyId) => ({ recordId: record.id, varietyId })),
        );
    }

    if (flavorIds.length > 0) {
      await tx
        .insert(recordFlavors)
        .values(
          flavorIds.map((flavorId) => ({ recordId: record.id, flavorId })),
        );
    }

    return { ...record, varietyIds, flavorIds };
  });
}

export async function updateRecord(
  userId: number,
  id: number,
  input: Partial<RecordInput>, // ユーティリティ型　オブジェクトの全てのプロパティを省略可能にする。
) {
  const { varietyIds, flavorIds, ...fields } = input;

  const found = await db.transaction(async (tx) => {
    const rows = await tx
      .update(records)
      .set({ ...fields, updatedAt: new Date() })
      .where(and(eq(records.id, id), eq(records.userId, userId)))
      .returning();
    if (rows.length === 0) {
      return false;
    }

    if (varietyIds !== undefined) {
      await tx.delete(recordVarieties).where(eq(recordVarieties.recordId, id));
      if (varietyIds.length > 0) {
        await tx
          .insert(recordVarieties)
          .values(varietyIds.map((varietyId) => ({ recordId: id, varietyId })));
      }
    }

    if (flavorIds !== undefined) {
      await tx.delete(recordFlavors).where(eq(recordFlavors.recordId, id));
      if (flavorIds.length > 0) {
        await tx
          .insert(recordFlavors)
          .values(flavorIds.map((flavorId) => ({ recordId: id, flavorId })));
      }
    }

    return true;
  });

  if (!found) {
    return undefined;
  }
  return findRecordById(userId, id);
}

export async function deleteRecord(userId: number, id: number) {
  const rows = await db
    .delete(records)
    .where(and(eq(records.id, id), eq(records.userId, userId)))
    .returning();
  return rows.length > 0;
}
