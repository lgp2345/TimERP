import { SetMetadata } from "@nestjs/common";

export const PERMISSIONS_METADATA_KEY = "auth:permissions";

export type PermissionMatchMode = "all" | "any";

export type PermissionsMetadata = {
  codes: string[];
  matchMode: PermissionMatchMode;
};

/**
 * Declares required permissions on route handlers or controllers using ALL-match mode.
 */
export function RequirePermissions(
  ...codes: string[]
): MethodDecorator & ClassDecorator {
  return SetMetadata(PERMISSIONS_METADATA_KEY, {
    codes,
    matchMode: "all",
  } satisfies PermissionsMetadata);
}

/**
 * Declares required permissions on route handlers or controllers using ANY-match mode.
 */
export function RequireAnyPermissions(
  ...codes: string[]
): MethodDecorator & ClassDecorator {
  return SetMetadata(PERMISSIONS_METADATA_KEY, {
    codes,
    matchMode: "any",
  } satisfies PermissionsMetadata);
}
