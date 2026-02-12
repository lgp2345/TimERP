import type { FastifyRequest } from "fastify";

export type AccessTokenClaims = {
  sub: string;
  companyId: string;
  membershipId: string;
  jti: string;
  type: "access";
};

export type RefreshTokenClaims = {
  sub: string;
  jti: string;
  type: "refresh";
};

export type AuthUser = {
  id: string;
  companyId: string;
  membershipId: string;
  jti: string;
  permissionCodes?: string[];
};

export type AuthenticatedRequest = FastifyRequest & {
  authUser?: AuthUser;
};
