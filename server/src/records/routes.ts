import { Hono } from "hono";
import { validate } from "../lib/validate.ts";
import { requireAuth } from "../auth/middleware.ts";
import {
  createRecord,
  findRecords,
  findRecordById,
  updateRecord,
  deleteRecord,
} from "./repository.ts";
import {
  recordIdSchema,
  recordInputSchema,
  recordQuerySchema,
  recordUpdateSchema,
} from "./validation.ts";

export const recordsRoutes = new Hono();

recordsRoutes.get(
  "/:id",
  requireAuth,
  validate("param", recordIdSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    const record = await findRecordById(c.get("user").id, id);

    if (!record) {
      return c.json(
        {
          error: { code: "record_not_found", message: "記録が見つかりません" },
        },
        404,
      );
    }
    return c.json(record);
  },
);

recordsRoutes.post(
  "/",
  requireAuth,
  validate("json", recordInputSchema),
  async (c) => {
    const body = c.req.valid("json");
    const record = await createRecord(c.get("user").id, body);
    return c.json(record, 201);
  },
);

recordsRoutes.patch(
  "/:id",
  requireAuth,
  validate("param", recordIdSchema),
  validate("json", recordUpdateSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    const body = c.req.valid("json");
    const record = await updateRecord(c.get("user").id, id, body);

    if (!record) {
      return c.json(
        {
          error: { code: "record_not_found", message: "記録が見つかりません" },
        },
        404,
      );
    }
    return c.json(record);
  },
);

recordsRoutes.delete(
  "/:id",
  requireAuth,
  validate("param", recordIdSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    const deleted = await deleteRecord(c.get("user").id, id);

    if (!deleted) {
      return c.json(
        {
          error: { code: "record_not_found", message: "記録が見つかりません" },
        },
        404,
      );
    }
    return c.body(null, 204);
  },
);

recordsRoutes.get(
  "/",
  requireAuth,
  validate("query", recordQuerySchema),
  async (c) => {
    const query = c.req.valid("query");
    const list = await findRecords(c.get("user").id, {
      limit: query.limit,
      originId: query.origin,
      varietyId: query.variety,
      processId: query.process,
      roastLevelId: query.roast,
      flavorId: query.flavor,
    });
    return c.json(list);
  },
);
