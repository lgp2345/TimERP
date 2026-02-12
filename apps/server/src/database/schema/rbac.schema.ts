import { boolean, pgTable, text, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { companies } from "./companies.schema";
import { memberships } from "./memberships.schema";

// Stores role definitions within companies.
export const roles = pgTable(
  "roles",
  {
    id: uuid("id").defaultRandom().primaryKey(), // Primary key
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }), // Company ID
    code: text("code").notNull(), // Role code (unique within company)
    name: text("name").notNull(), // Role name (unique within company)
    isSystem: boolean("is_system").notNull().default(false), // Whether it's a system role
  },
  (t) => [
    uniqueIndex("roles_company_code_unique").on(t.companyId, t.code),
    uniqueIndex("roles_company_name_unique").on(t.companyId, t.name),
  ]
);

// Stores global permission definitions.
export const permissions = pgTable("permissions", {
  id: uuid("id").defaultRandom().primaryKey(), // Primary key
  code: text("code").notNull().unique(), // Permission code (globally unique)
  resource: text("resource").notNull(), // Resource name (e.g., "user", "company")
  action: text("action").notNull(), // Action name (e.g., "create", "read", "update", "delete")
  effect: text("effect").notNull().default("allow"), // Effect (allow/deny)
  description: text("description"), // Permission description
});

// Junction table linking roles to permissions.
export const rolePermissions = pgTable(
  "role_permissions",
  {
    roleId: uuid("role_id")
      .notNull()
      .references(() => roles.id, { onDelete: "cascade" }), // Role ID
    permissionId: uuid("permission_id")
      .notNull()
      .references(() => permissions.id, { onDelete: "cascade" }), // Permission ID
  },
  (t) => [uniqueIndex("role_permissions_unique").on(t.roleId, t.permissionId)]
);

// Junction table linking memberships to roles.
export const membershipRoles = pgTable(
  "membership_roles",
  {
    membershipId: uuid("membership_id")
      .notNull()
      .references(() => memberships.id, { onDelete: "cascade" }), // Membership ID
    roleId: uuid("role_id")
      .notNull()
      .references(() => roles.id, { onDelete: "cascade" }), // Role ID
  },
  (t) => [uniqueIndex("membership_roles_unique").on(t.membershipId, t.roleId)]
);
