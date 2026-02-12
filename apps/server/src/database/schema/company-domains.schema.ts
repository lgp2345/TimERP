import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { companies } from "./companies.schema";

// Stores domain/host configurations for companies.
export const companyDomains = pgTable("company_domains", {
  id: uuid("id").defaultRandom().primaryKey(), // Primary key
  companyId: uuid("company_id")
    .notNull()
    .references(() => companies.id, { onDelete: "cascade" }), // Company ID
  host: text("host").notNull().unique(), // Domain host (globally unique)
  isPrimary: boolean("is_primary").notNull().default(false), // Whether it's the primary domain
  status: text("status").notNull().default("active"), // Domain status (active/inactive)
  createdAt: timestamp("created_at").notNull().defaultNow(), // Creation timestamp
  updatedAt: timestamp("updated_at").notNull().defaultNow(), // Last update timestamp
});
