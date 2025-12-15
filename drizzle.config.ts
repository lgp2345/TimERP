import type { Config } from "drizzle-kit";

export default {
  schema: "./apps/api/src/db/schema",
  out: "./apps/api/drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
  },
} satisfies Config;
