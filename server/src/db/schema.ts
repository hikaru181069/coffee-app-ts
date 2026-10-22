import {
  pgTable,
  serial,
  integer,
  text,
  boolean,
  timestamp,
  pgEnum,
  date,
  real,
  check,
  primaryKey,
} from "drizzle-orm/pg-core";

import { sql } from "drizzle-orm";

export const placeEnum = pgEnum("place", ["home", "cafe"]);

export const records = pgTable(
  "records",
  {
    id: serial().primaryKey(),
    userId: integer()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text().notNull(),
    drankOn: date().notNull(),
    place: placeEnum().notNull(),
    rating: integer(),
    notes: text(),
    cafeName: text(),
    roasterName: text(),
    originId: integer().references(() => origins.id),
    farmName: text(),
    processId: integer().references(() => processes.id),
    roastLevelId: integer().references(() => roastLevels.id),
    coffeeGrams: real(),
    waterMl: integer(),
    brewSeconds: integer(),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [check("rating_range", sql`${t.rating} between 1 and 10`)],
);

export const origins = pgTable("origins", {
  id: serial().primaryKey(),
  name: text().notNull().unique(),
});

export const varieties = pgTable("varieties", {
  id: serial().primaryKey(),
  name: text().notNull().unique(),
});

export const processes = pgTable("processes", {
  id: serial().primaryKey(),
  name: text().notNull().unique(),
});

export const roastLevels = pgTable("roast_levels", {
  id: serial().primaryKey(),
  name: text().notNull().unique(),
  sortOrder: integer().notNull().unique(),
});

export const flavors = pgTable("flavors", {
  id: serial().primaryKey(),
  name: text().notNull().unique(),
  category: text().notNull(),
});

export const users = pgTable("users", {
  id: serial().primaryKey(),
  email: text().notNull().unique(),
  passwordHash: text().notNull(),
  name: text().notNull(),
  isDemo: boolean().notNull().default(false),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

export const sessions = pgTable("sessions", {
  id: text().primaryKey(),
  userId: integer()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }), //あとで実行させたいから、アロー関数で書いている。
  expireAt: timestamp({ withTimezone: true }).notNull(),
});

export const recordVarieties = pgTable(
  "record_varieties",
  {
    recordId: integer()
      .notNull()
      .references(() => records.id, { onDelete: "cascade" }),
    varietyId: integer()
      .notNull()
      .references(() => varieties.id),
  },
  (t) => [primaryKey({ columns: [t.recordId, t.varietyId] })],
);

export const recordFlavors = pgTable(
  "record_flavors",
  {
    recordId: integer()
      .notNull()
      .references(() => records.id, { onDelete: "cascade" }),
    flavorId: integer()
      .notNull()
      .references(() => flavors.id),
  },
  (t) => [primaryKey({ columns: [t.recordId, t.flavorId] })],
);
