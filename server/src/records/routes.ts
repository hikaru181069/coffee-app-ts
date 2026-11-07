import { Hono } from "hono";
import { requireAuth } from "../auth/middleware.ts";
import {
  createRecord,
  findRecords,
  findRecordById,
  updateRecord,
  deleteRecord,
} from "./repository.ts";

export const recordsRoutes = new Hono();

recordsRoutes.get("/", requireAuth, async (c) => {
  const list = await findRecords(c.get("user").id);
  return c.json(list);
});

recordsRoutes.get("/:id", requireAuth, async (c) => {
  const id = Number(c.req.param("id"));
  const record = await findRecordById(c.get("user").id, id);

  if (!record) {
    return c.json({ error: "記録が見つかりません" }, 404);
  }
  return c.json(record);
});

recordsRoutes.post("/", requireAuth, async (c) => {
  const body = await c.req.json();
  const record = await createRecord(c.get("user").id, body);
  return c.json(record, 201);
});
recordsRoutes.patch("/:id", requireAuth, async (c) => {
  const id = Number(c.req.param("id"));
  const body = await c.req.json();
  const record = await updateRecord(c.get("user").id, id, body);

  if (!record) {
    return c.json({ error: "記録が見つかりません" }, 404);
  }
  return c.json(record);
});

recordsRoutes.delete("/:id", requireAuth, async (c) => {
  const id = Number(c.req.param("id"));
  const deleted = await deleteRecord(c.get("user").id, id);

  if (!deleted) {
    return c.json({ error: "記録が見つかりません" }, 404);
  }
  return c.body(null, 204);
});
