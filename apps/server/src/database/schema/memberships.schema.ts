import {
  index,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { users } from "./auth.schema";
import { companies } from "./companies.schema";

// Stores user-company membership relationships and member details.
export const memberships = pgTable(
  "memberships",
  {
    id: uuid("id").defaultRandom().primaryKey(), // Primary key
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }), // User ID
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }), // Company ID
    memberNo: text("member_no"), // Member number within company
    title: text("title"), // Job title/position
    status: text("status").notNull().default("active"), // Membership status (active/inactive)
    joinedAt: timestamp("joined_at").notNull().defaultNow(), // Join date
    invitedBy: uuid("invited_by").references(() => users.id, {
      onDelete: "set null",
    }), // User who invited this member
    deactivatedAt: timestamp("deactivated_at"), // Deactivation timestamp
    createdAt: timestamp("created_at").notNull().defaultNow(), // Creation timestamp
    updatedAt: timestamp("updated_at").notNull().defaultNow(), // Last update timestamp
  },
  (t) => [
    uniqueIndex("membership_user_company_unique").on(t.userId, t.companyId),
    uniqueIndex("membership_company_member_no_unique").on(
      t.companyId,
      t.memberNo
    ),
    index("membership_company_status_idx").on(t.companyId, t.status),
    index("membership_user_status_idx").on(t.userId, t.status),
  ]
);
