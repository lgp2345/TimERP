import { Injectable, UnauthorizedException } from "@nestjs/common";
import type {
  LoginRequest,
  LogoutRequest,
  RefreshSessionRequest,
  SwitchCompanyRequest,
} from "@repo/schema";
import { compare } from "bcryptjs";
import { and, eq, inArray, or } from "drizzle-orm";
import type { FastifyRequest } from "fastify";
import { DatabaseService } from "../../database/database.service";
import {
  companies,
  companyDomains,
  membershipRoles,
  memberships,
  permissions,
  refreshTokens,
  rolePermissions,
  roles,
  users,
} from "../../database/schema";
import { type AuthUser } from "./auth.types";
import { JwtAuthService } from "./jwt-auth.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly jwtAuthService: JwtAuthService
  ) {}

  private normalizeIdentifier(identifier: string): string {
    const value = identifier.trim();
    if (value.includes("@")) {
      return value.toLowerCase();
    }
    return value;
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

  private async resolveActiveMembershipForUser(userId: string, host?: string) {
    const db = this.databaseService.db;
    const membershipRows = await db
      .select({ id: memberships.id, companyId: memberships.companyId })
      .from(memberships)
      .where(
        and(eq(memberships.userId, userId), eq(memberships.status, "active"))
      );

    if (membershipRows.length === 0) {
      throw new UnauthorizedException("User has no active memberships");
    }

    const companyIdList = membershipRows.map((item) => item.companyId);
    let companyId = membershipRows[0]?.companyId;
    if (host) {
      const resolved = await db
        .select({ id: companies.id })
        .from(companies)
        .innerJoin(companyDomains, eq(companyDomains.companyId, companies.id))
        .where(
          and(
            eq(companyDomains.host, host),
            inArray(companies.id, companyIdList)
          )
        )
        .limit(1)
        .then((rows) => rows[0]);

      if (resolved?.id) {
        companyId = resolved.id;
      }
    }

    const membership =
      membershipRows.find((item) => item.companyId === companyId) ??
      membershipRows[0];
    if (!membership) {
      throw new UnauthorizedException("User has no active memberships");
    }

    return membership;
  }

  private async issueTokens(input: {
    userId: string;
    companyId: string;
    membershipId: string;
    req: FastifyRequest;
  }): Promise<{
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  }> {
    const { token: accessToken, expiresIn } =
      await this.jwtAuthService.issueAccessToken({
        userId: input.userId,
        companyId: input.companyId,
        membershipId: input.membershipId,
      });
    const { token: refreshToken, expiresAt } =
      await this.jwtAuthService.issueRefreshToken({
        userId: input.userId,
      });

    const userAgentRaw = input.req.headers["user-agent"];
    const userAgent = Array.isArray(userAgentRaw)
      ? userAgentRaw[0]
      : userAgentRaw;

    await this.databaseService.db.insert(refreshTokens).values({
      userId: input.userId,
      tokenHash: this.jwtAuthService.hashToken(refreshToken),
      expiresAt,
      ipAddress: input.req.ip,
      userAgent,
    });

    return { accessToken, refreshToken, expiresIn };
  }

  private async buildLoginResponse({
    companyId,
    membershipId,
    userId,
    accessToken,
    refreshToken,
    expiresIn,
  }: {
    companyId: string;
    membershipId: string;
    userId: string;
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  }) {
    const db = this.databaseService.db;

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
      accessToken,
      refreshToken,
      expiresIn,
    };
  }

  async login(input: LoginRequest, req: FastifyRequest) {
    const identifierRaw = input.identifier ?? input.userName ?? "";
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
    if (!user.passwordHash) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const passwordOk = await compare(input.password, user.passwordHash);
    if (!passwordOk) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const membership = await this.resolveMembership(user.id, company.id);
    const tokens = await this.issueTokens({
      userId: user.id,
      companyId: company.id,
      membershipId: membership.id,
      req,
    });

    return this.buildLoginResponse({
      companyId: company.id,
      membershipId: membership.id,
      userId: user.id,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresIn: tokens.expiresIn,
    });
  }

  async switchCompany(
    input: SwitchCompanyRequest,
    currentUser: AuthUser,
    req: FastifyRequest
  ) {
    const company = await this.resolveCompany(input.companyCode);
    const membership = await this.resolveMembership(currentUser.id, company.id);
    const tokens = await this.issueTokens({
      userId: currentUser.id,
      companyId: company.id,
      membershipId: membership.id,
      req,
    });

    return this.buildLoginResponse({
      companyId: company.id,
      membershipId: membership.id,
      userId: currentUser.id,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresIn: tokens.expiresIn,
    });
  }

  async refreshSession(
    input: RefreshSessionRequest,
    req: FastifyRequest,
    host?: string
  ) {
    const claims = await this.jwtAuthService.verifyRefreshToken(input.refreshToken);
    const now = new Date();
    const tokenHash = this.jwtAuthService.hashToken(input.refreshToken);
    const db = this.databaseService.db;
    const currentToken = await db
      .select()
      .from(refreshTokens)
      .where(
        and(
          eq(refreshTokens.userId, claims.sub),
          eq(refreshTokens.tokenHash, tokenHash)
        )
      )
      .limit(1)
      .then((rows) => rows[0]);

    if (
      !currentToken ||
      currentToken.revokedAt ||
      currentToken.expiresAt <= now
    ) {
      throw new UnauthorizedException("Invalid refresh token");
    }

    await db
      .update(refreshTokens)
      .set({ revokedAt: now, updatedAt: now })
      .where(eq(refreshTokens.id, currentToken.id));

    const hostName = host?.split(":")[0];
    const membership = await this.resolveActiveMembershipForUser(
      claims.sub,
      hostName
    );
    const tokens = await this.issueTokens({
      userId: claims.sub,
      companyId: membership.companyId,
      membershipId: membership.id,
      req,
    });

    return this.buildLoginResponse({
      companyId: membership.companyId,
      membershipId: membership.id,
      userId: claims.sub,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresIn: tokens.expiresIn,
    });
  }

  async logout(input: LogoutRequest) {
    try {
      const claims = await this.jwtAuthService.verifyRefreshToken(input.refreshToken);
      const tokenHash = this.jwtAuthService.hashToken(input.refreshToken);
      const now = new Date();
      await this.databaseService.db
        .update(refreshTokens)
        .set({
          revokedAt: now,
          updatedAt: now,
        })
        .where(
          and(
            eq(refreshTokens.userId, claims.sub),
            eq(refreshTokens.tokenHash, tokenHash)
          )
        );
    } catch {
      return { success: true };
    }

    return {
      success: true,
    };
  }
}
