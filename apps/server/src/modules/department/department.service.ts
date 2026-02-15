import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import type {
  AssignMembershipDepartmentRequest,
  CreateDepartmentRequest,
  ListDepartmentsRequest,
  SetDepartmentManagerRequest,
  SetPrimaryDepartmentRequest,
  UpdateDepartmentRequest,
} from "@repo/schema";
import { and, eq } from "drizzle-orm";
import { DatabaseService } from "../../database/database.service";
import {
  departments,
  membershipDepartments,
  memberships,
} from "../../database/schema";

type DepartmentRow = typeof departments.$inferSelect;

@Injectable()
export class DepartmentService {
  constructor(private readonly databaseService: DatabaseService) {}

  list(companyId: string, input: ListDepartmentsRequest) {
    const db = this.databaseService.db;
    const where = input.status
      ? and(
          eq(departments.companyId, companyId),
          eq(departments.status, input.status)
        )
      : eq(departments.companyId, companyId);
    return db.select().from(departments).where(where);
  }

  async tree(companyId: string, input: ListDepartmentsRequest) {
    const rows = await this.list(companyId, input);
    const nodeMap = new Map<
      string,
      DepartmentRow & {
        children: Array<DepartmentRow & { children: unknown[] }>;
      }
    >();
    const roots: Array<DepartmentRow & { children: unknown[] }> = [];

    for (const row of rows) {
      nodeMap.set(row.id, { ...row, children: [] });
    }

    for (const row of rows) {
      const node = nodeMap.get(row.id);
      if (!node) {
        continue;
      }
      if (!row.parentId) {
        roots.push(node);
        continue;
      }
      const parent = nodeMap.get(row.parentId);
      if (!parent) {
        roots.push(node);
        continue;
      }
      parent.children.push(node);
    }

    return roots;
  }

  async create(companyId: string, input: CreateDepartmentRequest) {
    await this.ensureUniqueCode(companyId, input.code);
    if (input.parentId) {
      await this.ensureDepartmentInCompany(companyId, input.parentId);
    }
    if (input.managerMembershipId) {
      await this.ensureMembershipInCompany(
        companyId,
        input.managerMembershipId
      );
    }

    const [created] = await this.databaseService.db
      .insert(departments)
      .values({
        companyId,
        code: input.code,
        name: input.name,
        parentId: input.parentId ?? null,
        managerMembershipId: input.managerMembershipId ?? null,
        status: "active",
      })
      .returning();

    if (!created) {
      throw new BadRequestException("Failed to create department");
    }
    return created;
  }

  async update(
    companyId: string,
    departmentId: string,
    input: UpdateDepartmentRequest
  ) {
    const current = await this.ensureDepartmentInCompany(
      companyId,
      departmentId
    );
    await this.validateUpdateInput(companyId, departmentId, current, input);
    const updateData = this.buildUpdateData(input);

    const [updated] = await this.databaseService.db
      .update(departments)
      .set(updateData)
      .where(
        and(
          eq(departments.id, departmentId),
          eq(departments.companyId, companyId)
        )
      )
      .returning();

    if (!updated) {
      throw new NotFoundException("Department not found");
    }
    return updated;
  }

  async remove(companyId: string, departmentId: string) {
    await this.ensureDepartmentInCompany(companyId, departmentId);
    const child = await this.databaseService.db
      .select({ id: departments.id })
      .from(departments)
      .where(
        and(
          eq(departments.companyId, companyId),
          eq(departments.parentId, departmentId)
        )
      )
      .limit(1)
      .then((rows) => rows[0]);
    if (child) {
      throw new BadRequestException("Department has child departments");
    }

    await this.databaseService.db
      .delete(departments)
      .where(
        and(
          eq(departments.id, departmentId),
          eq(departments.companyId, companyId)
        )
      );
    return { success: true };
  }

  async assignMembership(
    companyId: string,
    departmentId: string,
    input: AssignMembershipDepartmentRequest
  ) {
    await Promise.all([
      this.ensureDepartmentInCompany(companyId, departmentId),
      this.ensureMembershipInCompany(companyId, input.membershipId),
    ]);

    await this.databaseService.db.transaction(async (tx) => {
      if (input.isPrimary) {
        await tx
          .update(membershipDepartments)
          .set({ isPrimary: false, updatedAt: new Date() })
          .where(eq(membershipDepartments.membershipId, input.membershipId));
      }

      const existing = await tx
        .select()
        .from(membershipDepartments)
        .where(
          and(
            eq(membershipDepartments.membershipId, input.membershipId),
            eq(membershipDepartments.departmentId, departmentId)
          )
        )
        .limit(1)
        .then((rows) => rows[0]);

      if (existing) {
        await tx
          .update(membershipDepartments)
          .set({
            isPrimary: input.isPrimary ?? existing.isPrimary,
            updatedAt: new Date(),
          })
          .where(
            and(
              eq(membershipDepartments.membershipId, input.membershipId),
              eq(membershipDepartments.departmentId, departmentId)
            )
          );
      } else {
        await tx.insert(membershipDepartments).values({
          membershipId: input.membershipId,
          departmentId,
          isPrimary: input.isPrimary ?? false,
        });
      }
    });

    return { success: true };
  }

  async removeMembership(
    companyId: string,
    departmentId: string,
    membershipId: string
  ) {
    await Promise.all([
      this.ensureDepartmentInCompany(companyId, departmentId),
      this.ensureMembershipInCompany(companyId, membershipId),
    ]);

    await this.databaseService.db
      .delete(membershipDepartments)
      .where(
        and(
          eq(membershipDepartments.departmentId, departmentId),
          eq(membershipDepartments.membershipId, membershipId)
        )
      );

    return { success: true };
  }

  async setManager(
    companyId: string,
    departmentId: string,
    input: SetDepartmentManagerRequest
  ) {
    await this.ensureDepartmentInCompany(companyId, departmentId);
    if (input.managerMembershipId) {
      await this.ensureMembershipInCompany(
        companyId,
        input.managerMembershipId
      );
    }

    const [updated] = await this.databaseService.db
      .update(departments)
      .set({
        managerMembershipId: input.managerMembershipId ?? null,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(departments.id, departmentId),
          eq(departments.companyId, companyId)
        )
      )
      .returning();

    if (!updated) {
      throw new NotFoundException("Department not found");
    }
    return updated;
  }

  async setPrimaryDepartment(
    companyId: string,
    membershipId: string,
    input: SetPrimaryDepartmentRequest
  ) {
    await Promise.all([
      this.ensureMembershipInCompany(companyId, membershipId),
      this.ensureDepartmentInCompany(companyId, input.departmentId),
    ]);

    await this.databaseService.db.transaction(async (tx) => {
      await tx
        .update(membershipDepartments)
        .set({ isPrimary: false, updatedAt: new Date() })
        .where(eq(membershipDepartments.membershipId, membershipId));

      const existing = await tx
        .select()
        .from(membershipDepartments)
        .where(
          and(
            eq(membershipDepartments.membershipId, membershipId),
            eq(membershipDepartments.departmentId, input.departmentId)
          )
        )
        .limit(1)
        .then((rows) => rows[0]);

      if (existing) {
        await tx
          .update(membershipDepartments)
          .set({ isPrimary: true, updatedAt: new Date() })
          .where(
            and(
              eq(membershipDepartments.membershipId, membershipId),
              eq(membershipDepartments.departmentId, input.departmentId)
            )
          );
      } else {
        await tx.insert(membershipDepartments).values({
          membershipId,
          departmentId: input.departmentId,
          isPrimary: true,
        });
      }
    });

    return { success: true };
  }

  private async ensureUniqueCode(
    companyId: string,
    code: string
  ): Promise<void> {
    const existing = await this.databaseService.db
      .select({ id: departments.id })
      .from(departments)
      .where(
        and(eq(departments.companyId, companyId), eq(departments.code, code))
      )
      .limit(1)
      .then((rows) => rows[0]);
    if (existing) {
      throw new BadRequestException("Department code already exists");
    }
  }

  private async ensureDepartmentInCompany(
    companyId: string,
    departmentId: string
  ): Promise<DepartmentRow> {
    const row = await this.databaseService.db
      .select()
      .from(departments)
      .where(
        and(
          eq(departments.id, departmentId),
          eq(departments.companyId, companyId)
        )
      )
      .limit(1)
      .then((rows) => rows[0]);

    if (!row) {
      throw new NotFoundException("Department not found");
    }
    return row;
  }

  private async ensureMembershipInCompany(
    companyId: string,
    membershipId: string
  ): Promise<void> {
    const row = await this.databaseService.db
      .select({ id: memberships.id })
      .from(memberships)
      .where(
        and(
          eq(memberships.id, membershipId),
          eq(memberships.companyId, companyId),
          eq(memberships.status, "active")
        )
      )
      .limit(1)
      .then((rows) => rows[0]);

    if (!row) {
      throw new BadRequestException("Membership not found in company");
    }
  }

  private async ensureNoCycle(
    companyId: string,
    departmentId: string,
    parentId: string
  ): Promise<void> {
    const rows = await this.databaseService.db
      .select({ id: departments.id, parentId: departments.parentId })
      .from(departments)
      .where(eq(departments.companyId, companyId));

    const parentMap = new Map<string, string | null>();
    for (const row of rows) {
      parentMap.set(row.id, row.parentId);
    }

    let current: string | null = parentId;
    while (current) {
      if (current === departmentId) {
        throw new BadRequestException("Department parent creates cycle");
      }
      current = parentMap.get(current) ?? null;
    }
  }

  private async validateUpdateInput(
    companyId: string,
    departmentId: string,
    current: DepartmentRow,
    input: UpdateDepartmentRequest
  ): Promise<void> {
    if (input.code && input.code !== current.code) {
      await this.ensureUniqueCode(companyId, input.code);
    }
    if ("parentId" in input) {
      if (input.parentId === departmentId) {
        throw new BadRequestException("Department parent cannot be itself");
      }
      if (input.parentId) {
        await this.ensureDepartmentInCompany(companyId, input.parentId);
        await this.ensureNoCycle(companyId, departmentId, input.parentId);
      }
    }
    if ("managerMembershipId" in input && input.managerMembershipId) {
      await this.ensureMembershipInCompany(
        companyId,
        input.managerMembershipId
      );
    }
  }

  private buildUpdateData(
    input: UpdateDepartmentRequest
  ): Partial<typeof departments.$inferInsert> {
    const updateData: Partial<typeof departments.$inferInsert> = {
      updatedAt: new Date(),
    };

    if ("code" in input && input.code !== undefined) {
      updateData.code = input.code;
    }
    if ("name" in input && input.name !== undefined) {
      updateData.name = input.name;
    }
    if ("status" in input && input.status !== undefined) {
      updateData.status = input.status;
    }
    if ("parentId" in input) {
      updateData.parentId = input.parentId ?? null;
    }
    if ("managerMembershipId" in input) {
      updateData.managerMembershipId = input.managerMembershipId ?? null;
    }

    return updateData;
  }
}
