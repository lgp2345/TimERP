import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import {
  captchaResponseSchema,
  type LoginRequest,
  type LogoutRequest,
  loginRequestSchema,
  logoutRequestSchema,
  type RefreshSessionRequest,
  refreshSessionRequestSchema,
  type SwitchCompanyRequest,
  switchCompanyRequestSchema,
} from "@repo/schema";
import type { FastifyRequest } from "fastify";
import { I18nService } from "nestjs-i18n";
import { ZodError } from "zod";
import { ResponseMessage } from "../../common/decorators/response-message.decorator";
import { AuthGuard } from "./auth.guard";
import { AuthService } from "./auth.service";
import { type AuthUser } from "./auth.types";
import { AuthCaptchaService } from "./auth-captcha.service";
import { CurrentUser } from "./current-user.decorator";
import { PermissionsGuard } from "./permissions.guard";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly i18n: I18nService,
    private readonly authCaptchaService: AuthCaptchaService,
    private readonly authService: AuthService
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

  @Get("captcha")
  @ResponseMessage("captcha created")
  getCaptcha() {
    const captcha = this.authCaptchaService.createCaptcha();
    return captchaResponseSchema.parse(captcha);
  }

  @Post("login")
  @ResponseMessage("login success")
  login(@Body() body: unknown, @Req() req: FastifyRequest) {
    const input = this.parseBody<LoginRequest>(body, loginRequestSchema.parse);
    const captchaOk = this.authCaptchaService.verifyCaptcha(
      input.captchaId,
      input.captchaCode
    );
    if (!captchaOk) {
      throw new UnauthorizedException("Invalid captcha");
    }

    const identifierRaw = input.identifier ?? input.userName;
    if (!identifierRaw) {
      throw new BadRequestException(this.i18n.t("auth.userName.required"));
    }
    return this.authService.login(input, req);
  }

  @Post("switch-company")
  @UseGuards(AuthGuard, PermissionsGuard)
  @ResponseMessage("switch company success")
  switchCompany(
    @Body() body: unknown,
    @CurrentUser() currentUser: AuthUser,
    @Req() req: FastifyRequest
  ) {
    const input = this.parseBody<SwitchCompanyRequest>(
      body,
      switchCompanyRequestSchema.parse
    );
    return this.authService.switchCompany(input, currentUser, req);
  }

  @Post("refresh-session")
  @ResponseMessage("refresh success")
  refreshSession(
    @Body() body: unknown,
    @Req() req: FastifyRequest,
    @Headers("host") host?: string
  ) {
    const input = this.parseBody<RefreshSessionRequest>(
      body,
      refreshSessionRequestSchema.parse
    );

    return this.authService.refreshSession(input, req, host);
  }

  @Post("logout")
  @ResponseMessage("logout success")
  logout(@Body() body: unknown) {
    const input = this.parseBody<LogoutRequest>(
      body,
      logoutRequestSchema.parse
    );
    return this.authService.logout(input);
  }
}
