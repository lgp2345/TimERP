import { SetMetadata } from "@nestjs/common";
import { type PermissionCode } from "@repo/schema";

export const REQUIRE_PERMISSIONS_KEY = "auth:require_permissions";

export function RequirePermissions(...permissions: PermissionCode[]) {
  return SetMetadata(REQUIRE_PERMISSIONS_KEY, permissions);
}


