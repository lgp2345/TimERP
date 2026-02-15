import {
  type AnyPgColumn,
  index,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { companies } from "./companies.schema";
import { memberships } from "./memberships.schema";

// Stores department information within a company.
export const departments = pgTable(
  "departments",
  {
    id: uuid("id").defaultRandom().primaryKey(), // Primary key
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }), // Company ID
    parentId: uuid("parent_id").references((): AnyPgColumn => departments.id, {
      onDelete: "set null",
    }), // Parent department ID (self-reference)
    code: text("code").notNull(), // Department code unique within company
    name: text("name").notNull(), // Department name
    managerMembershipId: uuid("manager_membership_id").references(
      () => memberships.id,
      { onDelete: "set null" }
    ), // Manager membership ID
    status: text("status").notNull().default("active"), // Department status
    createdAt: timestamp("created_at").notNull().defaultNow(), // Creation timestamp
    updatedAt: timestamp("updated_at").notNull().defaultNow(), // Last update timestamp
  },
  (t) => [
    uniqueIndex("departments_company_code_unique").on(t.companyId, t.code),
    index("departments_company_status_idx").on(t.companyId, t.status),
    index("departments_parent_idx").on(t.parentId),
  ]
);
