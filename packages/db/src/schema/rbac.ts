import { pgTable, text, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { companies } from "./companies";
import { memberships } from "./memberships";

export const roles = pgTable(
  "roles",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
  },
  (t) => ({
    companyRoleNameUnique: uniqueIndex("roles_company_name_unique").on(
      t.companyId,
      t.name
    ),
  })
);

export const permissions = pgTable("permissions", {
  id: uuid("id").defaultRandom().primaryKey(),
  code: text("code").notNull().unique(),
  description: text("description"),
});

export const rolePermissions = pgTable(
  "role_permissions",
  {
    roleId: uuid("role_id")
      .notNull()
      .references(() => roles.id, { onDelete: "cascade" }),
    permissionId: uuid("permission_id")
      .notNull()
      .references(() => permissions.id, { onDelete: "cascade" }),
  },
  (t) => ({
    rolePermissionUnique: uniqueIndex("role_permissions_unique").on(
      t.roleId,
      t.permissionId
    ),
  })
);

export const membershipRoles = pgTable(
  "membership_roles",
  {
    membershipId: uuid("membership_id")
      .notNull()
      .references(() => memberships.id, { onDelete: "cascade" }),
    roleId: uuid("role_id")
      .notNull()
      .references(() => roles.id, { onDelete: "cascade" }),
  },
  (t) => ({
    membershipRoleUnique: uniqueIndex("membership_roles_unique").on(
      t.membershipId,
      t.roleId
    ),
  })
);
