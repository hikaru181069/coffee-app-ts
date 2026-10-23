import { db } from "../db/index.ts";
import { eq } from "drizzle-orm";
import { sessions, users } from "../db/schema.ts";

export async function createSession(data: {
  id: string;
  userId: number;
  expireAt: Date;
}) {
  const rows = await db.insert(sessions).values(data).returning();
  return rows[0];
}

export async function findSessionWithUser(id: string) {
  const rows = await db
    .select({ session: sessions, user: users })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(eq(sessions.id, id));
  return rows[0];
}

export async function deleteSession(id: string) {
  await db.delete(sessions).where(eq(sessions.id, id));
}
