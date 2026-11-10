import { z } from "zod";

const id = z.number().int().positive(); // 選択肢の番号（1以上の整数）

export const recordInputSchema = z.object({
  name: z.string().trim().min(1),
  drankOn: z.iso.date(),
  place: z.enum(["home", "cafe"]),
  rating: z.number().int().min(1).max(10).optional(),
  notes: z.string().optional(),
  cafeName: z.string().optional(),
  roasterName: z.string().optional(),
  originId: id.optional(),
  farmName: z.string().optional(),
  processId: id.optional(),
  roastLevelId: id.optional(),
  coffeeGrams: z.number().positive().optional(),
  waterMl: z.number().int().positive().optional(),
  brewSeconds: z.number().int().positive().optional(),
  varietyIds: z.array(id),
  flavorIds: z.array(id),
});

export const recordUpdateSchema = recordInputSchema.partial();

export type RecordInput = z.infer<typeof recordInputSchema>;
