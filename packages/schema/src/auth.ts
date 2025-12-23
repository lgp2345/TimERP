import { z } from "zod";

export const loginRequestSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export type LoginRequest = z.infer<typeof loginRequestSchema>;

export const loginResponseSchema = z.object({
  accessToken: z.string().min(1),
});

export type LoginResponse = z.infer<typeof loginResponseSchema>;

export const jwtClaimsSchema = z.object({
  sub: z.string().min(1),
  companyId: z.string().uuid(),
  jti: z.string().min(1),
});

export type JwtClaims = z.infer<typeof jwtClaimsSchema>;


