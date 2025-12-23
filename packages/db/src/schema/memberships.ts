import { pgTable, text, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { companies } from "./companies";
import { users } from "./users";

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
    status: text("status").notNull().default("active"),
  },
  (t) => ({
    userCompanyUnique: uniqueIndex("memberships_user_company_unique").on(
      t.userId,
      t.companyId,
    ),
  }),
);


