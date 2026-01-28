import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
} from "@nestjs/common";
import { type LoginRequest, loginRequestSchema } from "@repo/schema";
import { and, eq, sql } from "drizzle-orm";
import { I18nService } from "nestjs-i18n";
import { ZodError } from "zod";
import { DatabaseService } from "../../database/database.service";
import { companies, memberships, users } from "../../database/schema";
import { auth } from "./auth";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly i18n: I18nService,
    private readonly databaseService: DatabaseService
  ) {}

  @Post("login")
  async login(@Body() body: unknown) {
    let input: LoginRequest;
    try {
      input = loginRequestSchema.parse(body) as LoginRequest;
    } catch (error) {
      if (error instanceof ZodError) {
        const message = this.i18n.t(
          error.issues[0]?.message ?? "validation.error"
        );
        throw new BadRequestException(message);
      }
      throw error;
    }

    const db = this.databaseService.db;

    const company = await db
      .select()
      .from(companies)
      .where(eq(companies.code, input.companyCode))
      .limit(1)
      .then((rows) => rows[0]);

    if (!company) {
      throw new UnauthorizedException("Invalid company code");
    }

    const user = await db
      .select()
      .from(users)
      .where(eq(users.username, input.userName))
      .limit(1)
      .then((rows) => rows[0]);

    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const membership = await db
      .select()
      .from(memberships)
      .where(
        and(
          sql`${memberships.userId}::text = ${user.id}`,
          eq(memberships.companyId, company.id),
          eq(memberships.status, "active")
        )
      )
      .limit(1)
      .then((rows) => rows[0]);

    if (!membership) {
      throw new UnauthorizedException("User is not a member of this company");
    }

    const signInResponse = await auth.api.signInUsername({
      body: {
        username: input.userName,
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

    return {
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        companyId: company.id,
        companyCode: company.code,
      },
      session,
      cookies: setCookieHeader,
    };
  }
}
