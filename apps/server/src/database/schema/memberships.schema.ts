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

export const memberships = pgTable(
  "memberships",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    memberNo: text("member_no"),
    title: text("title"),
    status: text("status").notNull().default("active"),
    joinedAt: timestamp("joined_at").notNull().defaultNow(),
    invitedBy: uuid("invited_by").references(() => users.id, {
      onDelete: "set null",
    }),
    deactivatedAt: timestamp("deactivated_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => ({
    membershipUserCompanyUnique: uniqueIndex(
      "membership_user_company_unique"
    ).on(t.userId, t.companyId),
    membershipCompanyMemberNoUnique: uniqueIndex(
      "membership_company_member_no_unique"
    ).on(t.companyId, t.memberNo),
    membershipCompanyStatusIndex: index("membership_company_status_idx").on(
      t.companyId,
      t.status
    ),
    membershipUserStatusIndex: index("membership_user_status_idx").on(
      t.userId,
      t.status
    ),
  })
);
