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

const getDatabaseConfig = () => {
  const connectionString =
    process.env.DATABASE_URL ??
    "postgresql://postgres:postgres@localhost:5432/postgres";

  let password = "";
  try {
    password = new URL(connectionString).password ?? "";
  } catch {
    password = "";
  }

  return {
    connectionString,
    password,
  };
};

const pool = new Pool(getDatabaseConfig());

const schema = {
  users,
  accounts,
  sessions,
  verifications,
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
  user: {
    modelName: "users",
  },
  account: {
    modelName: "accounts",
  },
  session: {
    modelName: "sessions",
  },
  verification: {
    modelName: "verifications",
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
