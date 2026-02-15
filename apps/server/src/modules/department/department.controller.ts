import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  type AssignMembershipDepartmentRequest,
  assignMembershipDepartmentRequestSchema,
  type CreateDepartmentRequest,
  createDepartmentRequestSchema,
  type ListDepartmentsRequest,
  listDepartmentsRequestSchema,
  type SetDepartmentManagerRequest,
  type SetPrimaryDepartmentRequest,
  setDepartmentManagerRequestSchema,
  setPrimaryDepartmentRequestSchema,
  type UpdateDepartmentRequest,
  updateDepartmentRequestSchema,
} from "@repo/schema";
import { I18nService } from "nestjs-i18n";
import { ZodError } from "zod";
import { ResponseMessage } from "../../common/decorators/response-message.decorator";
import { AuthGuard } from "../auth/auth.guard";
import { type AuthUser } from "../auth/auth.types";
import { CurrentUser } from "../auth/current-user.decorator";
import { RequirePermissions } from "../auth/permissions.decorator";
import { PermissionsGuard } from "../auth/permissions.guard";
import { DepartmentService } from "./department.service";

@Controller("department")
@UseGuards(AuthGuard, PermissionsGuard)
export class DepartmentController {
  constructor(
    private readonly i18n: I18nService,
    private readonly departmentService: DepartmentService
  ) {}

  private parseBody<T>(body: unknown, parser: (input: unknown) => T): T {
    try {
      return parser(body);
    } catch (error) {
      if (error instanceof ZodError) {
        const message = this.i18n.t(
          error.issues[0]?.message ?? "validation.error"
        );
        throw new BadRequestException(message);
      }
      throw error;
    }
  }

  private parseQuery<T>(query: unknown, parser: (input: unknown) => T): T {
    try {
      return parser(query);
    } catch (error) {
      if (error instanceof ZodError) {
        const message = this.i18n.t(
          error.issues[0]?.message ?? "validation.error"
        );
        throw new BadRequestException(message);
      }
      throw error;
    }
  }

  @Get("tree")
  @RequirePermissions("department.read")
  @ResponseMessage("department tree fetched")
  tree(@CurrentUser() currentUser: AuthUser, @Query() query: unknown) {
    const input = this.parseQuery<ListDepartmentsRequest>(
      query,
      listDepartmentsRequestSchema.parse
    );
    return this.departmentService.tree(currentUser.companyId, input);
  }

  @Get()
  @RequirePermissions("department.read")
  @ResponseMessage("department list fetched")
  list(@CurrentUser() currentUser: AuthUser, @Query() query: unknown) {
    const input = this.parseQuery<ListDepartmentsRequest>(
      query,
      listDepartmentsRequestSchema.parse
    );
    return this.departmentService.list(currentUser.companyId, input);
  }

  @Post()
  @RequirePermissions("department.create")
  @ResponseMessage("department created")
  create(@CurrentUser() currentUser: AuthUser, @Body() body: unknown) {
    const input = this.parseBody<CreateDepartmentRequest>(
      body,
      createDepartmentRequestSchema.parse
    );
    return this.departmentService.create(currentUser.companyId, input);
  }

  @Patch(":id")
  @RequirePermissions("department.update")
  @ResponseMessage("department updated")
  update(
    @CurrentUser() currentUser: AuthUser,
    @Param("id") id: string,
    @Body() body: unknown
  ) {
    const input = this.parseBody<UpdateDepartmentRequest>(
      body,
      updateDepartmentRequestSchema.parse
    );
    return this.departmentService.update(currentUser.companyId, id, input);
  }

  @Delete(":id")
  @RequirePermissions("department.delete")
  @ResponseMessage("department deleted")
  remove(@CurrentUser() currentUser: AuthUser, @Param("id") id: string) {
    return this.departmentService.remove(currentUser.companyId, id);
  }

  @Post(":id/memberships")
  @RequirePermissions("department.member.manage")
  @ResponseMessage("department membership assigned")
  assignMembership(
    @CurrentUser() currentUser: AuthUser,
    @Param("id") id: string,
    @Body() body: unknown
  ) {
    const input = this.parseBody<AssignMembershipDepartmentRequest>(
      body,
      assignMembershipDepartmentRequestSchema.parse
    );
    return this.departmentService.assignMembership(
      currentUser.companyId,
      id,
      input
    );
  }

  @Delete(":id/memberships/:membershipId")
  @RequirePermissions("department.member.manage")
  @ResponseMessage("department membership removed")
  removeMembership(
    @CurrentUser() currentUser: AuthUser,
    @Param("id") id: string,
    @Param("membershipId") membershipId: string
  ) {
    return this.departmentService.removeMembership(
      currentUser.companyId,
      id,
      membershipId
    );
  }

  @Patch(":id/manager")
  @RequirePermissions("department.update")
  @ResponseMessage("department manager updated")
  setManager(
    @CurrentUser() currentUser: AuthUser,
    @Param("id") id: string,
    @Body() body: unknown
  ) {
    const input = this.parseBody<SetDepartmentManagerRequest>(
      body,
      setDepartmentManagerRequestSchema.parse
    );
    return this.departmentService.setManager(currentUser.companyId, id, input);
  }

  @Patch("memberships/:membershipId/primary-department")
  @RequirePermissions("department.member.manage")
  @ResponseMessage("primary department updated")
  setPrimaryDepartment(
    @CurrentUser() currentUser: AuthUser,
    @Param("membershipId") membershipId: string,
    @Body() body: unknown
  ) {
    const input = this.parseBody<SetPrimaryDepartmentRequest>(
      body,
      setPrimaryDepartmentRequestSchema.parse
    );
    return this.departmentService.setPrimaryDepartment(
      currentUser.companyId,
      membershipId,
      input
    );
  }
}
