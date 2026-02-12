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
};
