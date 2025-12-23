import { Body, Controller, Post, Req, Res, UnauthorizedException } from "@nestjs/common";
import { type FastifyReply } from "fastify";
import { loginRequestSchema } from "@repo/schema";
import { type Db } from "@repo/db";
import { createRedisRefreshTokenStore } from "../core/refresh-store";
import { issueAccessToken } from "../core/jwt";
import { parseCookieHeader, serializeCookie } from "../core/cookies";
import { verifyTenantCredentials } from "../core/credentials";
import { type AuthConfig, type RedisLike } from "../core/types";
import { AUTH_CONFIG, AUTH_DB, AUTH_REDIS } from "./tokens";
import { Inject } from "@nestjs/common";
import { type TenantRequest } from "./request-types";

@Controller("auth")
export class AuthController {
  constructor(
    @Inject(AUTH_DB) private readonly db: Db,
    @Inject(AUTH_REDIS) private readonly redis: RedisLike,
    @Inject(AUTH_CONFIG) private readonly config: AuthConfig,
  ) {}

  @Post("login")
  async login(@Req() req: TenantRequest, @Res({ passthrough: true }) res: FastifyReply, @Body() body: unknown) {
    const tenant = req.tenant;
    if (!tenant) throw new UnauthorizedException();

    const input = loginRequestSchema.parse(body);
    const verified = await verifyTenantCredentials({
      db: this.db,
      companyId: tenant.companyId,
      username: input.username,
      password: input.password,
    });
    if (!verified) throw new UnauthorizedException();

    const { token: accessToken } = await issueAccessToken(this.config.jwt, {
      userId: verified.userId,
      companyId: tenant.companyId,
    });

    const refreshStore = createRedisRefreshTokenStore(this.redis, this.config.refresh.refreshTtlSeconds);
    const { token: refreshToken } = await refreshStore.issue({
      userId: verified.userId,
      companyId: tenant.companyId,
    });

    const setCookie = serializeCookie({
      name: this.config.refresh.cookieName,
      value: refreshToken,
      httpOnly: true,
      secure: this.config.refresh.cookieSecure,
      sameSite: this.config.refresh.cookieSameSite,
      path: "/auth",
      maxAgeSeconds: this.config.refresh.refreshTtlSeconds,
    });
    res.header("set-cookie", setCookie);

    return { accessToken };
  }

  @Post("refresh")
  async refresh(@Req() req: TenantRequest, @Res({ passthrough: true }) res: FastifyReply) {
    const tenant = req.tenant;
    if (!tenant) throw new UnauthorizedException();

    const cookies = parseCookieHeader(
      typeof req.headers.cookie === "string" ? req.headers.cookie : undefined,
    );
    const refreshToken = cookies[this.config.refresh.cookieName];
    if (!refreshToken) throw new UnauthorizedException();

    const refreshStore = createRedisRefreshTokenStore(this.redis, this.config.refresh.refreshTtlSeconds);
    const rotated = await refreshStore.rotate({ token: refreshToken, companyId: tenant.companyId });
    if (!rotated) throw new UnauthorizedException();

    const { token: accessToken } = await issueAccessToken(this.config.jwt, {
      userId: rotated.userId,
      companyId: tenant.companyId,
    });

    const setCookie = serializeCookie({
      name: this.config.refresh.cookieName,
      value: rotated.token,
      httpOnly: true,
      secure: this.config.refresh.cookieSecure,
      sameSite: this.config.refresh.cookieSameSite,
      path: "/auth",
      maxAgeSeconds: this.config.refresh.refreshTtlSeconds,
    });
    res.header("set-cookie", setCookie);

    return { accessToken };
  }

  @Post("logout")
  async logout(@Req() req: TenantRequest, @Res({ passthrough: true }) res: FastifyReply) {
    const cookies = parseCookieHeader(
      typeof req.headers.cookie === "string" ? req.headers.cookie : undefined,
    );
    const refreshToken = cookies[this.config.refresh.cookieName];
    if (refreshToken) {
      const refreshStore = createRedisRefreshTokenStore(this.redis, this.config.refresh.refreshTtlSeconds);
      await refreshStore.revoke({ token: refreshToken });
    }

    const setCookie = serializeCookie({
      name: this.config.refresh.cookieName,
      value: "",
      httpOnly: true,
      secure: this.config.refresh.cookieSecure,
      sameSite: this.config.refresh.cookieSameSite,
      path: "/auth",
      maxAgeSeconds: 0,
    });
    res.header("set-cookie", setCookie);
    return { ok: true };
  }
}


