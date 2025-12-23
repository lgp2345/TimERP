import { Inject, Injectable, type NestMiddleware } from "@nestjs/common";
import { type Db } from "@repo/db";
import { resolveTenantFromHost } from "../core/tenant";
import { AUTH_DB } from "./tokens";
import { type TenantRequest } from "./request-types";

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(@Inject(AUTH_DB) private readonly db: Db) {}

  async use(req: unknown, _res: unknown, next: (err?: unknown) => void) {
    const request = req as TenantRequest;
    const hostHeader = request.headers?.host;
    const host = Array.isArray(hostHeader) ? hostHeader[0] : hostHeader;

    const tenant = await resolveTenantFromHost(this.db, host);
    if (tenant) request.tenant = tenant;

    next();
  }
}


