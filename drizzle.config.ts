import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "turso",
  dbCredentials: {
    url: process.env.TURSO_DB_URL || "file:./data/sqlite.db",
    authToken: process.env.TURSO_AUTH_TOKEN,
  },
});
