import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SignJWT, jwtVerify } from "jose";
import { createHash, randomUUID } from "node:crypto";
import { type AccessTokenClaims, type RefreshTokenClaims } from "./auth.types";

@Injectable()
export class JwtAuthService {
  private readonly accessTtlSeconds: number;
  private readonly refreshTtlSeconds: number;
  private readonly accessSecret: Uint8Array;
  private readonly refreshSecret: Uint8Array;

  constructor(private readonly configService: ConfigService) {
    const baseSecret = this.configService.get<string>("BETTER_AUTH_SECRET");
    const accessSecret =
      this.configService.get<string>("JWT_ACCESS_SECRET") ?? baseSecret;
    const refreshSecret =
      this.configService.get<string>("JWT_REFRESH_SECRET") ?? baseSecret;

    if (!accessSecret || !refreshSecret) {
      throw new Error("JWT_ACCESS_SECRET and JWT_REFRESH_SECRET are required");
    }

    this.accessSecret = new TextEncoder().encode(accessSecret);
    this.refreshSecret = new TextEncoder().encode(refreshSecret);
    this.accessTtlSeconds = this.readTtl("JWT_ACCESS_EXPIRES_IN", 3600);
    this.refreshTtlSeconds = this.readTtl("JWT_REFRESH_EXPIRES_IN", 60 * 60 * 24 * 30);
  }

  private readTtl(key: string, fallbackSeconds: number): number {
    const value = this.configService.get<string>(key);
    const parsed = Number.parseInt(value ?? "", 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallbackSeconds;
  }

  hashToken(token: string): string {
    return createHash("sha256").update(token).digest("hex");
  }

  async issueAccessToken(input: {
    userId: string;
    companyId: string;
    membershipId: string;
  }): Promise<{ token: string; expiresIn: number; claims: AccessTokenClaims }> {
    const jti = randomUUID();
    const claims: AccessTokenClaims = {
      sub: input.userId,
      companyId: input.companyId,
      membershipId: input.membershipId,
      jti,
      type: "access",
    };

    const token = await new SignJWT({
      companyId: claims.companyId,
      membershipId: claims.membershipId,
      type: claims.type,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setSubject(claims.sub)
      .setJti(claims.jti)
      .setIssuedAt()
      .setExpirationTime(`${this.accessTtlSeconds}s`)
      .sign(this.accessSecret);

    return {
      token,
      expiresIn: this.accessTtlSeconds,
      claims,
    };
  }

  async issueRefreshToken(input: {
    userId: string;
  }): Promise<{ token: string; expiresAt: Date; claims: RefreshTokenClaims }> {
    const jti = randomUUID();
    const claims: RefreshTokenClaims = {
      sub: input.userId,
      jti,
      type: "refresh",
    };

    const token = await new SignJWT({
      type: claims.type,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setSubject(claims.sub)
      .setJti(claims.jti)
      .setIssuedAt()
      .setExpirationTime(`${this.refreshTtlSeconds}s`)
      .sign(this.refreshSecret);

    const expiresAt = new Date(Date.now() + this.refreshTtlSeconds * 1000);
    return { token, expiresAt, claims };
  }

  async verifyAccessToken(token: string): Promise<AccessTokenClaims> {
    try {
      const { payload } = await jwtVerify(token, this.accessSecret, {
        algorithms: ["HS256"],
      });

      if (
        typeof payload.sub !== "string" ||
        typeof payload.jti !== "string" ||
        payload.type !== "access" ||
        typeof payload.companyId !== "string" ||
        typeof payload.membershipId !== "string"
      ) {
        throw new UnauthorizedException("Invalid access token");
      }

      return {
        sub: payload.sub,
        companyId: payload.companyId,
        membershipId: payload.membershipId,
        jti: payload.jti,
        type: "access",
      };
    } catch {
      throw new UnauthorizedException("Invalid access token");
    }
  }

  async verifyRefreshToken(token: string): Promise<RefreshTokenClaims> {
    try {
      const { payload } = await jwtVerify(token, this.refreshSecret, {
        algorithms: ["HS256"],
      });

      if (
        typeof payload.sub !== "string" ||
        typeof payload.jti !== "string" ||
        payload.type !== "refresh"
      ) {
        throw new UnauthorizedException("Invalid refresh token");
      }

      return {
        sub: payload.sub,
        jti: payload.jti,
        type: "refresh",
      };
    } catch {
      throw new UnauthorizedException("Invalid refresh token");
    }
  }
}
