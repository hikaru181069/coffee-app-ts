import { Hono } from "hono";
import { findAllOptions } from "./repository.ts";

export const optionsRoutes = new Hono();

optionsRoutes.get("/", async (c) => {
  const options = await findAllOptions();
  return c.json(options);
});
