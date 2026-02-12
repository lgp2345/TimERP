import {
  type CanActivate,
  type ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { eq } from "drizzle-orm";
import { DatabaseService } from "../../database/database.service";
import {
  membershipRoles,
  permissions,
  rolePermissions,
  roles,
} from "../../database/schema";
import { type AuthenticatedRequest } from "./auth.types";
import {
  PERMISSIONS_METADATA_KEY,
  type PermissionsMetadata,
} from "./permissions.decorator";

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly databaseService: DatabaseService
  ) {}

  /**
   * Checks whether the current authenticated user has the required permissions for the route.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const metadata = this.reflector.getAllAndOverride<
      PermissionsMetadata | undefined
    >(PERMISSIONS_METADATA_KEY, [context.getHandler(), context.getClass()]);
    if (!metadata || metadata.codes.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const authUser = request.authUser;
    if (!authUser) {
      throw new UnauthorizedException("Unauthorized");
    }

    const existingCodes = authUser.permissionCodes;
    const permissionCodes =
      existingCodes ??
      (await this.getActivePermissionCodes(authUser.membershipId));
    if (!existingCodes) {
      authUser.permissionCodes = permissionCodes;
    }

    const permissionSet = new Set(permissionCodes);
    const isAllowed =
      metadata.matchMode === "any"
        ? metadata.codes.some((code) => permissionSet.has(code))
        : metadata.codes.every((code) => permissionSet.has(code));
    if (!isAllowed) {
      throw new ForbiddenException("Insufficient permissions");
    }
    return true;
  }

  /**
   * Resolves all active permission codes for the specified membership.
   */
  private async getActivePermissionCodes(
    membershipId: string
  ): Promise<string[]> {
    const rows = await this.databaseService.db
      .select({ code: permissions.code })
      .from(membershipRoles)
      .innerJoin(roles, eq(membershipRoles.roleId, roles.id))
      .innerJoin(rolePermissions, eq(rolePermissions.roleId, roles.id))
      .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
      .where(eq(membershipRoles.membershipId, membershipId));

    return [...new Set(rows.map((row) => row.code))];
  }
}
