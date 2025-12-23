import { eq } from "drizzle-orm";
import { type Db, schema } from "@repo/db";

export function normalizeHost(hostHeader: string | undefined): string | null {
  if (!hostHeader) return null;
  const host = hostHeader.split(",")[0]?.trim() ?? "";
  const withoutPort = host.includes(":") ? host.split(":")[0] ?? "" : host;
  return withoutPort.trim() ? withoutPort.trim().toLowerCase() : null;
}

export async function resolveTenantFromHost(db: Db, hostHeader: string | undefined) {
  const host = normalizeHost(hostHeader);
  if (!host) return null;

  const row = await db
    .select({ companyId: schema.companyDomains.companyId })
    .from(schema.companyDomains)
    .where(eq(schema.companyDomains.host, host))
    .limit(1);

  const companyId = row[0]?.companyId;
  if (!companyId) return null;

  return { companyId, host };
}


