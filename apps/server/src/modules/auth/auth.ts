import { createDb, createPgPool } from "@repo/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { bearer, jwt, username } from "better-auth/plugins";

const pool = createPgPool({
  connectionString: process.env.DATABASE_URL ?? "",
});

const db = createDb(pool);

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    username(),
    jwt({
      jwt: {
        expirationTime: "1h",
      },
    }),
    bearer(),
  ],
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
});

export type Session = typeof auth.$Infer.Session;
