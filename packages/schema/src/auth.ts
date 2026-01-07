import { z } from "zod";

export const loginRequestSchema = z.object({
  userName: z.string().trim().min(1, "auth.userName.required"),
  password: z.string().trim().min(1, "auth.password.required").regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/,
    "auth.password.rules"
  ),
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


