import { defineConfig } from "drizzle-kit";

process.loadEnvFile(".env");

export default defineConfig({
  dialect: "postgresql",
  casing: "snake_case",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
