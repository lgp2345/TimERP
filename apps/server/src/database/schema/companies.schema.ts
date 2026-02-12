import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

// Stores company/organization information.
export const companies = pgTable("companies", {
  id: uuid("id").defaultRandom().primaryKey(), // Primary key
  code: text("code").notNull().unique(), // Company code (globally unique)
  name: text("name").notNull(), // Company name
  status: text("status").notNull().default("active"), // Company status (active/inactive)
  createdAt: timestamp("created_at").notNull().defaultNow(), // Creation timestamp
  updatedAt: timestamp("updated_at").notNull().defaultNow(), // Last update timestamp
});
