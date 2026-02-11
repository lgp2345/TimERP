import {
  boolean,
  index,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { companies } from "./companies.schema";

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name"),
    username: text("username").notNull(),
    email: text("email"),
    emailVerified: boolean("email_verified").notNull().default(false),
    phone: text("phone"),
    phoneVerified: boolean("phone_verified").notNull().default(false),
    image: text("image"),
    status: text("status").notNull().default("active"),
    lastLoginAt: timestamp("last_login_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => ({
    userUsernameUnique: uniqueIndex("user_username_unique").on(t.username),
    userEmailUnique: uniqueIndex("user_email_unique").on(t.email),
    userPhoneUnique: uniqueIndex("user_phone_unique").on(t.phone),
    userEmailIndex: index("user_email_idx").on(t.email),
    userPhoneIndex: index("user_phone_idx").on(t.phone),
  })
);

export const accounts = pgTable(
  "account",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => ({
    accountProviderAccountUnique: uniqueIndex(
      "account_provider_account_unique"
    ).on(t.providerId, t.accountId),
    accountUserIdIndex: index("account_user_id_idx").on(t.userId),
  })
);

export const sessions = pgTable(
  "session",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    token: text("token").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    activeCompanyId: uuid("active_company_id").references(() => companies.id, {
      onDelete: "set null",
    }),
    activeMembershipId: uuid("active_membership_id"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => ({
    sessionTokenUnique: uniqueIndex("session_token_unique").on(t.token),
    sessionUserIdIndex: index("session_user_id_idx").on(t.userId),
    sessionActiveCompanyIndex: index("session_active_company_idx").on(
      t.activeCompanyId
    ),
    sessionActiveMembershipIndex: index("session_active_membership_idx").on(
      t.activeMembershipId
    ),
  })
);

export const verifications = pgTable(
  "verification",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => ({
    verificationIdentifierIndex: index("verification_identifier_idx").on(
      t.identifier
    ),
    verificationIdentifierValueUnique: uniqueIndex(
      "verification_identifier_value_unique"
    ).on(t.identifier, t.value),
  })
);
