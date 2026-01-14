import { Inject, Injectable, type NestMiddleware } from "@nestjs/common";
import { resolveTenantFromHost } from "@repo/auth";
import type { Db } from "@repo/db";
import type { TenantRequest } from "./request-types";
import { AUTH_DB } from "./tokens";

/**
 * 租户解析中间件
 * 从 HTTP Host 头中提取域名，查询数据库获取对应的租户（公司）信息
 * 并将租户上下文附加到请求对象上，供后续的控制器和守卫使用
 *
 * 该中间件会在所有路由之前执行
 */
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
