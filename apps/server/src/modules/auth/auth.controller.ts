import { Body, Controller, Post, Req, Res, UnauthorizedException, Inject, BadRequestException } from "@nestjs/common";
import { I18nService } from "nestjs-i18n";
import { type FastifyReply } from "fastify";
import { ZodError } from "zod";
import { loginRequestSchema } from "@repo/schema";
import { type Db } from "@repo/db";
import {
  createRedisRefreshTokenStore,
  issueAccessToken,
  parseCookieHeader,
  serializeCookie,
  verifyTenantCredentials,
  type AuthConfig,
  type RedisLike,
} from "@repo/auth";
import { AUTH_CONFIG, AUTH_DB, AUTH_REDIS } from "./tokens";
import { type TenantRequest } from "./request-types";

/**
 * 认证 REST API 控制器
 * 处理登录、刷新令牌和登出端点
 * 
 * - 登录：验证用户名密码，返回访问令牌（JWT）和刷新令牌（HTTP-only Cookie）
 * - 刷新：使用刷新令牌获取新的访问令牌，并轮换刷新令牌
 * - 登出：撤销刷新令牌并清除 Cookie
 */
@Controller("auth")
export class AuthController {
  constructor(
    @Inject(AUTH_DB) private readonly db: Db,
    @Inject(AUTH_REDIS) private readonly redis: RedisLike,
    @Inject(AUTH_CONFIG) private readonly config: AuthConfig,
    private readonly i18n: I18nService,
  ) {}

  /**
   * 用户登录
   * POST /auth/login
   * 
   * 请求体：{ username: string, password: string }
   * 返回：{ accessToken: string }
   * 
   * 刷新令牌会通过 HTTP-only Cookie 返回，名称为配置中的 cookieName
   */
  @Post("login")
  async login(@Req() req: TenantRequest, @Res({ passthrough: true }) res: FastifyReply, @Body() body: unknown) {
    const tenant = req.tenant;
    if (!tenant) throw new UnauthorizedException();

    let input;
    try {
      input = loginRequestSchema.parse(body);
    } catch (error) {
      if (error instanceof ZodError) {
        const message = this.i18n.t(error.issues[0]?.message ?? "validation.error");
        throw new BadRequestException(message);
      }
      throw error;
    }
    // 验证用户名密码和租户成员关系
    const verified = await verifyTenantCredentials({
      db: this.db,
      companyId: tenant.companyId,
      username: input.username,
      password: input.password,
    });
    if (!verified) throw new UnauthorizedException();

    // 签发访问令牌（JWT）
    const { token: accessToken } = await issueAccessToken(this.config.jwt, {
      userId: verified.userId,
      companyId: tenant.companyId,
    });

    // 生成并存储刷新令牌
    const refreshStore = createRedisRefreshTokenStore(this.redis, this.config.refresh.refreshTtlSeconds);
    const { token: refreshToken } = await refreshStore.issue({
      userId: verified.userId,
      companyId: tenant.companyId,
    });

    // 将刷新令牌设置为 HTTP-only Cookie
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

  /**
   * 刷新访问令牌
   * POST /auth/refresh
   * 
   * 从 Cookie 中读取刷新令牌，轮换后返回新的访问令牌
   * 刷新令牌会在轮换时自动更新（防止令牌重用攻击）
   */
  @Post("refresh")
  async refresh(@Req() req: TenantRequest, @Res({ passthrough: true }) res: FastifyReply) {
    const tenant = req.tenant;
    if (!tenant) throw new UnauthorizedException();

    // 从 Cookie 中提取刷新令牌
    const cookies = parseCookieHeader(
      typeof req.headers.cookie === "string" ? req.headers.cookie : undefined,
    );
    const refreshToken = cookies[this.config.refresh.cookieName];
    if (!refreshToken) throw new UnauthorizedException();

    // 轮换刷新令牌（旧令牌失效，返回新令牌）
    const refreshStore = createRedisRefreshTokenStore(this.redis, this.config.refresh.refreshTtlSeconds);
    const rotated = await refreshStore.rotate({ token: refreshToken, companyId: tenant.companyId });
    if (!rotated) throw new UnauthorizedException();

    // 签发新的访问令牌
    const { token: accessToken } = await issueAccessToken(this.config.jwt, {
      userId: rotated.userId,
      companyId: tenant.companyId,
    });

    // 更新 Cookie 中的刷新令牌
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

  /**
   * 用户登出
   * POST /auth/logout
   * 
   * 撤销刷新令牌并清除 Cookie
   */
  @Post("logout")
  async logout(@Req() req: TenantRequest, @Res({ passthrough: true }) res: FastifyReply) {
    const cookies = parseCookieHeader(
      typeof req.headers.cookie === "string" ? req.headers.cookie : undefined,
    );
    const refreshToken = cookies[this.config.refresh.cookieName];
    if (refreshToken) {
      // 撤销刷新令牌
      const refreshStore = createRedisRefreshTokenStore(this.redis, this.config.refresh.refreshTtlSeconds);
      await refreshStore.revoke({ token: refreshToken });
    }

    // 清除 Cookie（设置 Max-Age 为 0）
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

