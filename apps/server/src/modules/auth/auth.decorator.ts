import { createParamDecorator, type ExecutionContext } from "@nestjs/common";
import { type TenantRequest } from "./request-types";

/**
 * 参数装饰器：获取当前用户信息
 * 在控制器方法中使用，从请求中提取已认证的用户信息
 * 
 * @example
 * ```typescript
 * @Get()
 * async getProfile(@CurrentUser() user) {
 *   return user;
 * }
 * ```
 */
export const CurrentUser = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest() as TenantRequest;
  return req.user ?? null;
});

/**
 * 参数装饰器：获取当前租户信息
 * 在控制器方法中使用，从请求中提取租户上下文（由 TenantMiddleware 填充）
 * 
 * @example
 * ```typescript
 * @Get()
 * async getCompany(@CurrentTenant() tenant) {
 *   return tenant;
 * }
 * ```
 */
export const CurrentTenant = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest() as TenantRequest;
  return req.tenant ?? null;
});

