/**
 * 认证模块导出
 * 统一导出认证相关的模块、守卫、装饰器等
 */

export { CurrentTenant, CurrentUser } from "./auth.decorator";
export { AuthGuard } from "./auth.guard";
export { AuthModule } from "./auth.module";
export {
  REQUIRE_PERMISSIONS_KEY,
  RequirePermissions,
} from "./permissions.decorator";
export { RbacGuard } from "./rbac.guard";
export type { TenantRequest } from "./request-types";
export { AUTH_CONFIG, AUTH_DB, AUTH_REDIS } from "./tokens";
