import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { bearer, jwt, username } from "better-auth/plugins";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import {
  accounts,
  companies,
  companyDomains,
  membershipRoles,
  memberships,
  permissions,
  rolePermissions,
  roles,
  sessions,
  users,
  verifications,
} from "../../database/schema";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL ?? "",
});

const schema = {
  user: users,
  account: accounts,
  session: sessions,
  verification: verifications,
  companies,
  companyDomains,
  memberships,
  membershipRoles,
  permissions,
  rolePermissions,
  roles,
};

const db = drizzle(pool, { schema });

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
