import { z } from "zod";

export const loginRequestSchema = z.object({
  companyCode: z.string().trim().min(4, "auth.companyCode.required"),
  identifier: z.string().trim().min(2, "auth.userName.required").optional(),
  userName: z.string().trim().min(2, "auth.userName.required").optional(),
  password: z.string().trim().min(6, "auth.password.required"),
});

export const switchCompanyRequestSchema = z.object({
  companyCode: z.string().trim().min(4, "auth.companyCode.required"),
});

export type LoginRequest = z.infer<typeof loginRequestSchema>;
export type SwitchCompanyRequest = z.infer<typeof switchCompanyRequestSchema>;

export const loginResponseSchema = z.object({
  user: z.object({
    id: z.string(),
    name: z.string().nullable(),
    username: z.string().nullable().optional(),
    email: z.string().nullable().optional(),
    phone: z.string().nullable().optional(),
    status: z.string().optional(),
    companyId: z.string(),
    companyCode: z.string(),
  }),
  company: z
    .object({
      id: z.string(),
      code: z.string(),
      name: z.string(),
      status: z.string(),
    })
    .optional(),
  membership: z
    .object({
      id: z.string(),
      status: z.string(),
      title: z.string().nullable(),
      memberNo: z.string().nullable(),
    })
    .optional(),
  permissions: z.array(z.string()).optional(),
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
