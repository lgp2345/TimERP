import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  Post,
  Req,
  UnauthorizedException,
} from "@nestjs/common";
import {
  type LoginRequest,
  loginRequestSchema,
  type SwitchCompanyRequest,
  switchCompanyRequestSchema,
} from "@repo/schema";
import { and, eq, inArray, or } from "drizzle-orm";
import type { FastifyRequest } from "fastify";
import { I18nService } from "nestjs-i18n";
import { ZodError } from "zod";
import { DatabaseService } from "../../database/database.service";
import {
  companies,
  companyDomains,
  membershipRoles,
  memberships,
  permissions,
  rolePermissions,
  roles,
  sessions,
  users,
} from "../../database/schema";
import { auth } from "./auth";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly i18n: I18nService,
    private readonly databaseService: DatabaseService
  ) {}

  private normalizeIdentifier(identifier: string): string {
    const value = identifier.trim();
    if (value.includes("@")) {
      return value.toLowerCase();
    }
    return value;
  }

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

  private async getActivePermissions(membershipId: string): Promise<string[]> {
    const db = this.databaseService.db;
    const rows = await db
      .select({ code: permissions.code })
      .from(membershipRoles)
      .innerJoin(roles, eq(membershipRoles.roleId, roles.id))
      .innerJoin(rolePermissions, eq(rolePermissions.roleId, roles.id))
      .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
      .where(eq(membershipRoles.membershipId, membershipId));

    const permissionSet = new Set<string>();
    for (const row of rows) {
      permissionSet.add(row.code);
    }
    return [...permissionSet];
  }

  private getCookie(headers: FastifyRequest["headers"]): string {
    return typeof headers.cookie === "string" ? headers.cookie : "";
  }

  private async getSessionByCookie(cookie: string) {
    if (!cookie) {
      throw new UnauthorizedException("No session cookie");
    }
    const sessionData = await auth.api.getSession({
      headers: {
        cookie,
      },
    });
    const sessionId = sessionData?.session?.id;
    const userId = sessionData?.user?.id;
    if (!sessionId) {
      throw new UnauthorizedException("Invalid session");
    }
    if (!userId) {
      throw new UnauthorizedException("Invalid session");
    }
    return sessionData;
  }

  private async resolveCompany(companyCode: string) {
    const db = this.databaseService.db;
    const company = await db
      .select()
      .from(companies)
      .where(eq(companies.code, companyCode))
      .limit(1)
      .then((rows) => rows[0]);

    if (!company) {
      throw new UnauthorizedException("Invalid company code");
    }
    if (company.status !== "active") {
      throw new UnauthorizedException("Company is not active");
    }
    return company;
  }

  private async resolveMembership(userId: string, companyId: string) {
    const db = this.databaseService.db;
    const membership = await db
      .select()
      .from(memberships)
      .where(
        and(
          eq(memberships.userId, userId),
          eq(memberships.companyId, companyId),
          eq(memberships.status, "active")
        )
      )
      .limit(1)
      .then((rows) => rows[0]);

    if (!membership) {
      throw new UnauthorizedException("User is not an active member");
    }
    return membership;
  }

  private async buildLoginResponse({
    companyId,
    membershipId,
    sessionId,
    userId,
    setCookieHeader,
    sessionPayload,
  }: {
    companyId: string;
    membershipId: string;
    sessionId: string;
    userId: string;
    setCookieHeader: string;
    sessionPayload: unknown;
  }) {
    const db = this.databaseService.db;

    await db
      .update(sessions)
      .set({
        activeCompanyId: companyId,
        activeMembershipId: membershipId,
        updatedAt: new Date(),
      })
      .where(eq(sessions.id, sessionId));

    await db
      .update(users)
      .set({
        lastLoginAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    const [company, membership, user] = await Promise.all([
      db
        .select()
        .from(companies)
        .where(eq(companies.id, companyId))
        .limit(1)
        .then((rows) => rows[0]),
      db
        .select()
        .from(memberships)
        .where(eq(memberships.id, membershipId))
        .limit(1)
        .then((rows) => rows[0]),
      db
        .select()
        .from(users)
        .where(eq(users.id, userId))
        .limit(1)
        .then((rows) => rows[0]),
    ]);

    if (!company) {
      throw new UnauthorizedException("Failed to build session context");
    }
    if (!membership) {
      throw new UnauthorizedException("Failed to build session context");
    }
    if (!user) {
      throw new UnauthorizedException("Failed to build session context");
    }

    const permissionCodes = await this.getActivePermissions(membership.id);

    return {
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        status: user.status,
        companyId: company.id,
        companyCode: company.code,
      },
      company: {
        id: company.id,
        code: company.code,
        name: company.name,
        status: company.status,
      },
      membership: {
        id: membership.id,
        status: membership.status,
        title: membership.title,
        memberNo: membership.memberNo,
      },
      permissions: permissionCodes,
      session: sessionPayload,
      cookies: setCookieHeader,
    };
  }

  @Post("login")
  async login(@Body() body: unknown) {
    const input = this.parseBody<LoginRequest>(body, loginRequestSchema.parse);
    const identifierRaw = input.identifier ?? input.userName;
    if (!identifierRaw) {
      throw new BadRequestException(this.i18n.t("auth.userName.required"));
    }
    const identifier = this.normalizeIdentifier(identifierRaw);

    const db = this.databaseService.db;
    const company = await this.resolveCompany(input.companyCode);

    const matchedUsers = await db
      .select()
      .from(users)
      .where(
        or(
          eq(users.email, identifier),
          eq(users.phone, identifier),
          eq(users.username, identifier)
        )
      )
      .limit(1);

    const user = matchedUsers[0];
    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }
    if (user.status !== "active") {
      throw new UnauthorizedException("User is not active");
    }

    const membership = await this.resolveMembership(user.id, company.id);

    const signInResponse =
      user.email && identifier.includes("@")
        ? await auth.api.signInEmail({
            body: {
              email: user.email,
              password: input.password,
            },
            headers: {},
            asResponse: true,
          })
        : await auth.api.signInUsername({
            body: {
              username: user.username,
              password: input.password,
            },
            headers: {},
            asResponse: true,
          });

    if (!signInResponse || signInResponse.status !== 200) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const setCookieHeader = signInResponse.headers.get("set-cookie") ?? "";
    const session = await auth.api.getSession({
      headers: {
        cookie: setCookieHeader,
      },
    });
    if (!session?.session?.id) {
      throw new UnauthorizedException("Failed to create session");
    }

    return this.buildLoginResponse({
      companyId: company.id,
      membershipId: membership.id,
      sessionId: session.session.id,
      userId: user.id,
      setCookieHeader,
      sessionPayload: session,
    });
  }

  @Post("switch-company")
  async switchCompany(@Body() body: unknown, @Req() req: FastifyRequest) {
    const input = this.parseBody<SwitchCompanyRequest>(
      body,
      switchCompanyRequestSchema.parse
    );
    const cookie = this.getCookie(req.headers);
    const sessionData = await this.getSessionByCookie(cookie);
    const company = await this.resolveCompany(input.companyCode);
    const membership = await this.resolveMembership(
      sessionData.user.id,
      company.id
    );

    const db = this.databaseService.db;
    await db
      .update(sessions)
      .set({
        activeCompanyId: company.id,
        activeMembershipId: membership.id,
        updatedAt: new Date(),
      })
      .where(eq(sessions.id, sessionData.session.id));

    return this.buildLoginResponse({
      companyId: company.id,
      membershipId: membership.id,
      sessionId: sessionData.session.id,
      userId: sessionData.user.id,
      setCookieHeader: cookie,
      sessionPayload: sessionData,
    });
  }

  @Post("refresh-session")
  async refreshSession(
    @Req() req: FastifyRequest,
    @Headers("host") host?: string
  ) {
    const cookie = this.getCookie(req.headers);
    const sessionData = await this.getSessionByCookie(cookie);
    const db = this.databaseService.db;

    const membershipIds = await db
      .select({ id: memberships.id, companyId: memberships.companyId })
      .from(memberships)
      .where(
        and(
          eq(memberships.userId, sessionData.user.id),
          eq(memberships.status, "active")
        )
      );

    if (membershipIds.length === 0) {
      throw new UnauthorizedException("User has no active memberships");
    }

    const companyIdList = membershipIds.map((item) => item.companyId);
    const activeCompany = await db
      .select()
      .from(companies)
      .where(inArray(companies.id, companyIdList))
      .limit(1)
      .then((rows) => rows[0]);

    if (!activeCompany) {
      throw new UnauthorizedException("No active company context");
    }

    const hostName = host?.split(":")[0];
    let company:
      | {
          id: string;
          code: string;
          name: string;
          status: string;
          createdAt: Date;
          updatedAt: Date;
        }
      | undefined;
    if (hostName) {
      company = await db
        .select()
        .from(companies)
        .innerJoin(companyDomains, eq(companyDomains.companyId, companies.id))
        .where(eq(companyDomains.host, hostName))
        .limit(1)
        .then((rows) => rows[0]?.company);
    }

    const resolvedCompanyId = company?.id ?? activeCompany.id;
    const membership = await this.resolveMembership(
      sessionData.user.id,
      resolvedCompanyId
    );

    return this.buildLoginResponse({
      companyId: resolvedCompanyId,
      membershipId: membership.id,
      sessionId: sessionData.session.id,
      userId: sessionData.user.id,
      setCookieHeader: cookie,
      sessionPayload: sessionData,
    });
  }

  @Post("logout")
  async logout(@Req() req: FastifyRequest) {
    const cookie = this.getCookie(req.headers);
    if (!cookie) {
      return { success: true };
    }

    const response = await auth.api.signOut({
      headers: {
        cookie,
      },
      asResponse: true,
    });

    return {
      success: true,
      cookies: response.headers.get("set-cookie") ?? "",
    };
  }
}
