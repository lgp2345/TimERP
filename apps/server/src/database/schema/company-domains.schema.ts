import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { companies } from "./companies.schema";

export const companyDomains = pgTable("company_domains", {
  id: uuid("id").defaultRandom().primaryKey(),
  companyId: uuid("company_id")
    .notNull()
    .references(() => companies.id, { onDelete: "cascade" }),
  host: text("host").notNull().unique(),
  isPrimary: boolean("is_primary").notNull().default(false),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
