import { eq } from "drizzle-orm";
import { db } from "../db/index.ts";
import { users } from "../db/schema.ts";

export async function findUserByEmail(email: string) {
  const rows = await db.select().from(users).where(eq(users.email, email));
  return rows[0];
}

export async function createUser(data: {
  email: string;
  passwordHash: string;
  name: string;
}) {
  const rows = await db.insert(users).values(data).returning();
  return rows[0];
}
