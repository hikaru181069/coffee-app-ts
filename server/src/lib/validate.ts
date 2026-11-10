import type { ValidationTargets } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

z.config(z.locales.ja());

export function validate<
  T extends z.ZodType,
  Target extends keyof ValidationTargets,
>(target: Target, schema: T) {
  return zValidator(target, schema, (result, c) => {
    if (!result.success) {
      const fields: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = issue.path.join(".");
        fields[key] ??= issue.message;
      }
      return c.json(
        {
          error: {
            code: "validation_error",
            message: "入力間違ってるんご",
            fields,
          },
        },
        400,
      );
    }
  });
}
