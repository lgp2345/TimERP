import { and, eq } from "drizzle-orm";
import { type Db, schema } from "@repo/db";
import { verifyPassword } from "./password";

export async function verifyTenantCredentials(args: {
  db: Db;
  companyId: string;
  username: string;
  password: string;
}): Promise<{ userId: string } | null> {
  const userRow = await args.db
    .select({ id: schema.users.id, passwordHash: schema.users.passwordHash })
    .from(schema.users)
    .where(eq(schema.users.username, args.username))
    .limit(1);

  const user = userRow[0];
  if (!user) return null;
  if (!verifyPassword(args.password, user.passwordHash)) return null;

  const membershipRow = await args.db
    .select({ id: schema.memberships.id })
    .from(schema.memberships)
    .where(
      and(
        eq(schema.memberships.userId, user.id),
        eq(schema.memberships.companyId, args.companyId),
        eq(schema.memberships.status, "active"),
      ),
    )
    .limit(1);

  const membership = membershipRow[0];
  if (!membership) return null;

  return { userId: user.id };
}


