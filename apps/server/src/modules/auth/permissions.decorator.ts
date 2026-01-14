import { SetMetadata } from "@nestjs/common";
import type { PermissionCode } from "@repo/schema";

/**
 * 权限元数据的键名
 */
export const REQUIRE_PERMISSIONS_KEY = "auth:require_permissions";

/**
 * 方法装饰器：要求特定的权限
 * 与 RbacGuard 配合使用，用于在控制器方法上声明所需的权限
 *
 * @example
 * ```typescript
 * @RequirePermissions("user:read", "user:write")
 * @Get()
 * async getUsers() { ... }
 * ```
 */
export function RequirePermissions(...permissions: PermissionCode[]) {
  return SetMetadata(REQUIRE_PERMISSIONS_KEY, permissions);
}
