import { and, eq } from "drizzle-orm";
import { type Db, schema } from "@repo/db";
import { type RedisLike } from "./types";

export async function resolveUserPermissions(args: {
  db: Db;
  redis: RedisLike | null;
  userId: string;
  companyId: string;
  cacheTtlSeconds: number;
}): Promise<string[]> {
  const cacheKey = `perm:${args.companyId}:${args.userId}`;
  if (args.redis) {
    const cached = await args.redis.get(cacheKey);
    if (cached) {
      try {
        const parsed = JSON.parse(cached) as unknown;
        if (Array.isArray(parsed) && parsed.every((v) => typeof v === "string")) return parsed;
      } catch {
        // ignore
      }
    }
  }

  const membership = await args.db
    .select({ membershipId: schema.memberships.id })
    .from(schema.memberships)
    .where(and(eq(schema.memberships.userId, args.userId), eq(schema.memberships.companyId, args.companyId)))
    .limit(1);

  const membershipId = membership[0]?.membershipId;
  if (!membershipId) return [];

  const rows = await args.db
    .select({ code: schema.permissions.code })
    .from(schema.membershipRoles)
    .innerJoin(schema.roles, eq(schema.membershipRoles.roleId, schema.roles.id))
    .innerJoin(schema.rolePermissions, eq(schema.roles.id, schema.rolePermissions.roleId))
    .innerJoin(schema.permissions, eq(schema.rolePermissions.permissionId, schema.permissions.id))
    .where(eq(schema.membershipRoles.membershipId, membershipId));

  const codes = Array.from(new Set(rows.map((r) => r.code)));

  if (args.redis) {
    await args.redis.set(cacheKey, JSON.stringify(codes), "EX", String(args.cacheTtlSeconds));
  }

  return codes;
}


