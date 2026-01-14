import { randomUUID } from "node:crypto";
import { type JwtClaims, jwtClaimsSchema } from "@repo/schema";
import { jwtVerify, SignJWT } from "jose";
import type { AccessTokenPayload, AuthJwtConfig } from "./types";

function getKey(secret: string): Uint8Array {
  return new TextEncoder().encode(secret);
}

export async function issueAccessToken(
  config: AuthJwtConfig,
  payload: Omit<AccessTokenPayload, "jti"> & { jti?: string }
): Promise<{ token: string; jti: string }> {
  const jti = payload.jti ?? randomUUID();
  const token = await new SignJWT({
    companyId: payload.companyId,
    jti,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.userId)
    .setIssuedAt()
    .setExpirationTime(`${config.accessTtlSeconds}s`)
    .sign(getKey(config.secret));

  return { token, jti };
}

export async function verifyAccessToken(
  config: AuthJwtConfig,
  token: string
): Promise<JwtClaims> {
  const result = await jwtVerify(token, getKey(config.secret));
  const claims: JwtClaims = {
    sub: typeof result.payload.sub === "string" ? result.payload.sub : "",
    companyId:
      typeof result.payload.companyId === "string"
        ? result.payload.companyId
        : "",
    jti: typeof result.payload.jti === "string" ? result.payload.jti : "",
  };
  return jwtClaimsSchema.parse(claims);
}
