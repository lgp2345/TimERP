import { z } from "zod";

export const permissionCodeSchema = z.string().min(1);

export type PermissionCode = z.infer<typeof permissionCodeSchema>;


