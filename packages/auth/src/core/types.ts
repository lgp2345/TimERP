export type TenantContext = {
  companyId: string;
  host: string;
};

export type AuthJwtConfig = {
  secret: string;
  accessTtlSeconds: number;
};

export type AuthRefreshConfig = {
  cookieName: string;
  refreshTtlSeconds: number;
  cookieSecure: boolean;
  cookieSameSite: "lax" | "strict" | "none";
};

export type AuthConfig = {
  jwt: AuthJwtConfig;
  refresh: AuthRefreshConfig;
  permissionsCacheTtlSeconds: number;
};

export type AccessTokenPayload = {
  userId: string;
  companyId: string;
  jti: string;
};

export type RedisLike = {
  get: (key: string) => Promise<string | null>;
  set: (key: string, value: string, ...args: string[]) => Promise<unknown>;
  del: (...keys: string[]) => Promise<unknown>;
};
