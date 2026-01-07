/**
 * 认证模块导出
 * 统一导出认证相关的模块、守卫、装饰器等
 */
export { AuthModule } from "./auth.module";
export { AuthGuard } from "./auth.guard";
export { RbacGuard } from "./rbac.guard";
export { CurrentTenant, CurrentUser } from "./auth.decorator";
export { RequirePermissions, REQUIRE_PERMISSIONS_KEY } from "./permissions.decorator";
export { AUTH_CONFIG, AUTH_DB, AUTH_REDIS } from "./tokens";
export type { TenantRequest } from "./request-types";

