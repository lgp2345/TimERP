import {
  boolean,
  index,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { departments } from "./departments.schema";
import { memberships } from "./memberships.schema";

// Stores many-to-many relationships between memberships and departments.
export const membershipDepartments = pgTable(
  "membership_departments",
  {
    membershipId: uuid("membership_id")
      .notNull()
      .references(() => memberships.id, { onDelete: "cascade" }), // Membership ID
    departmentId: uuid("department_id")
      .notNull()
      .references(() => departments.id, { onDelete: "cascade" }), // Department ID
    isPrimary: boolean("is_primary").notNull().default(false), // Whether this is the primary department
    createdAt: timestamp("created_at").notNull().defaultNow(), // Creation timestamp
    updatedAt: timestamp("updated_at").notNull().defaultNow(), // Last update timestamp
  },
  (t) => [
    uniqueIndex("membership_departments_unique").on(
      t.membershipId,
      t.departmentId
    ),
    index("membership_departments_membership_idx").on(t.membershipId),
    index("membership_departments_department_idx").on(t.departmentId),
  ]
);
