import { z } from "zod";

export const listDepartmentsRequestSchema = z.object({
  status: z.string().trim().min(1).optional(),
});

export const createDepartmentRequestSchema = z.object({
  code: z.string().trim().min(1, "department.code.required"),
  name: z.string().trim().min(1, "department.name.required"),
  parentId: z.string().uuid().optional().nullable(),
  managerMembershipId: z.string().uuid().optional().nullable(),
});

export const updateDepartmentRequestSchema = z.object({
  code: z.string().trim().min(1, "department.code.required").optional(),
  name: z.string().trim().min(1, "department.name.required").optional(),
  parentId: z.string().uuid().optional().nullable(),
  managerMembershipId: z.string().uuid().optional().nullable(),
  status: z.string().trim().min(1).optional(),
});

export const assignMembershipDepartmentRequestSchema = z.object({
  membershipId: z.string().uuid(),
  isPrimary: z.boolean().optional(),
});

export const setPrimaryDepartmentRequestSchema = z.object({
  departmentId: z.string().uuid(),
});

export const setDepartmentManagerRequestSchema = z.object({
  managerMembershipId: z.string().uuid().nullable(),
});

export type ListDepartmentsRequest = z.infer<
  typeof listDepartmentsRequestSchema
>;
export type CreateDepartmentRequest = z.infer<
  typeof createDepartmentRequestSchema
>;
export type UpdateDepartmentRequest = z.infer<
  typeof updateDepartmentRequestSchema
>;
export type AssignMembershipDepartmentRequest = z.infer<
  typeof assignMembershipDepartmentRequestSchema
>;
export type SetPrimaryDepartmentRequest = z.infer<
  typeof setPrimaryDepartmentRequestSchema
>;
export type SetDepartmentManagerRequest = z.infer<
  typeof setDepartmentManagerRequestSchema
>;
