import { z } from "zod";

export const loginRequestSchema = z.object({
  companyCode: z.string().trim().min(4, "auth.companyCode.required"),
  userName: z.string().trim().min(2, "auth.userName.required"),
  password: z.string().trim().min(6, "auth.password.required"),
  // .regex(
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/,
  //   "auth.password.rules"
  // ),
});

export type LoginRequest = z.infer<typeof loginRequestSchema>;

export const loginResponseSchema = z.object({
  user: z.object({
    id: z.string(),
    name: z.string().nullable(),
    username: z.string().nullable(),
    companyId: z.string(),
    companyCode: z.string(),
  }),
  session: z.any().optional(),
  cookies: z.string().optional(),
});

export type LoginResponse = z.infer<typeof loginResponseSchema>;

export const jwtClaimsSchema = z.object({
  sub: z.string().min(1),
  companyId: z.string().uuid(),
  jti: z.string().min(1),
});

export type JwtClaims = z.infer<typeof jwtClaimsSchema>;
