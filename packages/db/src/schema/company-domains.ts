import { boolean, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { companies } from "./companies";

export const companyDomains = pgTable("company_domains", {
  id: uuid("id").defaultRandom().primaryKey(),
  companyId: uuid("company_id")
    .notNull()
    .references(() => companies.id, { onDelete: "cascade" }),
  host: text("host").notNull().unique(),
  isPrimary: boolean("is_primary").notNull().default(false),
  status: text("status").notNull().default("active"),
});


