import { type JwtClaims } from "@repo/schema";
import { type TenantContext } from "@repo/auth";

/**
 * 扩展的请求类型，用于 NestJS/Fastify
 * 添加了租户和用户上下文，由中间件和守卫填充
 */
export type TenantRequest = {
  headers: Record<string, string | string[] | undefined>;
  tenant?: TenantContext;
  user?: JwtClaims;
  raw?: Record<string, unknown>;
};

