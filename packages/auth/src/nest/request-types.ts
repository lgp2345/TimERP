import { type JwtClaims } from "@repo/schema";
import { type TenantContext } from "../core/types";

export type TenantRequest = {
  headers: Record<string, string | string[] | undefined>;
  tenant?: TenantContext;
  user?: JwtClaims;
  raw?: Record<string, unknown>;
};


