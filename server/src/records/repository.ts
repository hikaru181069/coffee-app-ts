import { db } from "../db/index.ts";
import { records, recordVarieties, recordFlavors } from "../db/schema.ts";
import { and, desc, eq, inArray, type SQL } from "drizzle-orm";

import type { RecordInput } from "./validation.ts";

type RecordFilters = {
  limit?: number;
  originId?: number;
  varietyId?: number;
  processId?: number;
  roastLevelId?: number;
  flavorId?: number;
};

export async function findRecords(userId: number, filters: RecordFilters) {
  const conditions: SQL[] = [eq(records.userId, userId)];

  if (filters.originId !== undefined) {
    conditions.push(eq(records.originId, filters.originId));
  }
  if (filters.processId !== undefined) {
    conditions.push(eq(records.processId, filters.processId));
  }
  if (filters.roastLevelId !== undefined) {
    conditions.push(eq(records.roastLevelId, filters.roastLevelId));
  }
  if (filters.varietyId !== undefined) {
    conditions.push(
      inArray(
        records.id,
        db
          .select({ id: recordVarieties.recordId })
          .from(recordVarieties)
          .where(eq(recordVarieties.varietyId, filters.varietyId)),
      ),
    );
  }
  if (filters.flavorId !== undefined) {
    conditions.push(
      inArray(
        records.id,
        db
          .select({ id: recordFlavors.recordId })
          .from(recordFlavors)
          .where(eq(recordFlavors.flavorId, filters.flavorId)),
      ),
    );
  }

  let query = db
    .select()
    .from(records)
    .where(and(...conditions))
    .orderBy(desc(records.drankOn), desc(records.createdAt))
    .$dynamic();
  if (filters.limit !== undefined) {
    query = query.limit(filters.limit);
  }

  const rows = await query;
  return attachTags(rows);
}

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
