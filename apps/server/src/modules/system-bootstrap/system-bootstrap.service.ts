import {
  Injectable,
  Logger,
  type OnApplicationBootstrap,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { eq } from "drizzle-orm";
import { DatabaseService } from "../../database";
import {
  companies,
  membershipRoles,
  memberships,
  roles,
  users,
} from "../../database/schema";

@Injectable()
export class SystemBootstrapService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SystemBootstrapService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly databaseService: DatabaseService
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    if (!this.isEnabled()) {
      return;
    }
    const companyCode = this.getRequiredEnv("BOOTSTRAP_COMPANY_CODE");
    const companyName = this.getRequiredEnv("BOOTSTRAP_COMPANY_NAME");
    const adminUsername = this.getRequiredEnv("BOOTSTRAP_ADMIN_USERNAME");
    const adminPassword = this.getRequiredEnv("BOOTSTRAP_ADMIN_PASSWORD");

    const company = await this.ensureCompany(companyCode, companyName);
    const user = await this.ensureAdminUser(adminUsername, adminPassword);
    const role = await this.ensureOwnerRole(company.id);
    const membership = await this.ensureMembership(user.id, company.id);
    await this.ensureMembershipRole(membership.id, role.id);

    this.logger.log(
      `system bootstrap completed: company=${company.code}, user=${user.username}, role=${role.code}`
    );
  }

  private isEnabled(): boolean {
    const raw = this.configService.get<string>("BOOTSTRAP_ENABLED");
    return raw === "1" || raw === "true";
  }

  private getRequiredEnv(key: string): string {
    const value = this.configService.get<string>(key)?.trim();
    if (!value) {
      throw new Error(`${key} is required when BOOTSTRAP_ENABLED=true`);
    }
    return value;
  }

  private async ensureCompany(code: string, name: string) {
    const db = this.databaseService.db;
    const existing = await db
      .select()
      .from(companies)
      .where(eq(companies.code, code))
      .limit(1)
      .then((rows) => rows[0]);

    if (existing) {
      return existing;
    }

    await db
      .insert(companies)
      .values({
        code,
        name,
        status: "active",
      })
      .onConflictDoNothing();

    const created = await db
      .select()
      .from(companies)
      .where(eq(companies.code, code))
      .limit(1)
      .then((rows) => rows[0]);

    if (!created) {
      throw new Error(`failed to ensure company: ${code}`);
    }
    return created;
  }

  private async ensureAdminUser(username: string, password: string) {
    const db = this.databaseService.db;

    const existing = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1)
      .then((rows) => rows[0]);

    if (existing) {
      return existing;
    }

    const result = await db
      .insert(users)
      .values({
        username,
        name: username,
        status: "active",
      })
      .onConflictDoNothing()
      .returning();

    if (!result[0]) {
      throw new Error("bootstrap admin user not found after sign up");
    }
    return result[0];
  }

  private async ensureOwnerRole(companyId: string) {
    const db = this.databaseService.db;
    const code = "owner";
    const existing = await db
      .select()
      .from(roles)
      .where(eq(roles.companyId, companyId))
      .limit(100)
      .then((rows) => rows.find((item) => item.code === code));

    if (existing) {
      return existing;
    }

    await db.insert(roles).values({
      companyId,
      code,
      name: "Owner",
      isSystem: true,
    });

    const created = await db
      .select()
      .from(roles)
      .where(eq(roles.companyId, companyId))
      .limit(100)
      .then((rows) => rows.find((item) => item.code === code));

    if (!created) {
      throw new Error(`failed to ensure owner role for company=${companyId}`);
    }
    return created;
  }

  private async ensureMembership(userId: string, companyId: string) {
    const db = this.databaseService.db;
    const existing = await db
      .select()
      .from(memberships)
      .where(eq(memberships.userId, userId))
      .limit(100)
      .then((rows) => rows.find((item) => item.companyId === companyId));

    if (existing) {
      return existing;
    }

    await db
      .insert(memberships)
      .values({
        userId,
        companyId,
        title: "Owner",
        status: "active",
      })
      .onConflictDoNothing();

    const created = await db
      .select()
      .from(memberships)
      .where(eq(memberships.userId, userId))
      .limit(100)
      .then((rows) => rows.find((item) => item.companyId === companyId));

    if (!created) {
      throw new Error(
        `failed to ensure membership for user=${userId}, company=${companyId}`
      );
    }
    return created;
  }

  private async ensureMembershipRole(
    membershipId: string,
    roleId: string
  ): Promise<void> {
    const db = this.databaseService.db;
    await db
      .insert(membershipRoles)
      .values({
        membershipId,
        roleId,
      })
      .onConflictDoNothing();
  }
}
