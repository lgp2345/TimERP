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

// Stores user profile and account-level status data.
export const users = pgTable(
  "users",
  {
    // Primary key for the user record.
    id: uuid("id").defaultRandom().primaryKey(),
    // Display name shown in UI.
    name: text("name"),
    // Unique username used for login/identification.
    username: text("username").notNull(),
    // User email address.
    email: text("email"),
    // Whether email has been verified.
    emailVerified: boolean("email_verified").notNull().default(false),
    // User phone number.
    phone: text("phone"),
    // Whether phone has been verified.
    phoneVerified: boolean("phone_verified").notNull().default(false),
    // Avatar image URL.
    image: text("image"),
    // Business status of the user account.
    status: text("status").notNull().default("active"),
    // Last successful login time.
    lastLoginAt: timestamp("last_login_at"),
    // Record creation time.
    createdAt: timestamp("created_at").notNull().defaultNow(),
    // Record last update time.
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("user_username_unique").on(t.username),
    uniqueIndex("user_email_unique").on(t.email),
    uniqueIndex("user_phone_unique").on(t.phone),
    index("user_email_idx").on(t.email),
    index("user_phone_idx").on(t.phone),
  ]
);

// Stores authentication credentials/accounts linked to a user.
export const accounts = pgTable(
  "account",
  {
    // Primary key for the account record.
    id: uuid("id").defaultRandom().primaryKey(),
    // Provider-side account identifier.
    accountId: text("account_id").notNull(),
    // Authentication provider identifier.
    providerId: text("provider_id").notNull(),
    // Linked user who owns this auth account.
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    // OAuth access token.
    accessToken: text("access_token"),
    // OAuth refresh token.
    refreshToken: text("refresh_token"),
    // OpenID Connect ID token.
    idToken: text("id_token"),
    // Expiration time of access token.
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    // Expiration time of refresh token.
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    // Granted OAuth scopes.
    scope: text("scope"),
    // Password hash for password-based auth providers.
    password: text("password"),
    // Record creation time.
    createdAt: timestamp("created_at").notNull().defaultNow(),
    // Record last update time.
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("account_provider_account_unique").on(
      t.providerId,
      t.accountId
    ),
    index("account_user_id_idx").on(t.userId),
  ]
);

// Stores active login sessions and current tenant context.
export const sessions = pgTable(
  "session",
  {
    // Primary key for the session record.
    id: uuid("id").defaultRandom().primaryKey(),
    // Session token used for authentication.
    token: text("token").notNull(),
    // Session expiration time.
    expiresAt: timestamp("expires_at").notNull(),
    // Client IP captured at session creation/use.
    ipAddress: text("ip_address"),
    // Client user-agent string.
    userAgent: text("user_agent"),
    // User that owns this session.
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    // Active company/tenant in current session context.
    activeCompanyId: uuid("active_company_id").references(() => companies.id, {
      onDelete: "set null",
    }),
    // Active membership in current session context.
    activeMembershipId: uuid("active_membership_id"),
    // Record creation time.
    createdAt: timestamp("created_at").notNull().defaultNow(),
    // Record last update time.
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("session_token_unique").on(t.token),
    index("session_user_id_idx").on(t.userId),
    index("session_active_company_idx").on(t.activeCompanyId),
    index("session_active_membership_idx").on(t.activeMembershipId),
  ]
);

// Stores verification artifacts like OTP/code/email verification values.
export const verifications = pgTable(
  "verification",
  {
    // Primary key for the verification record.
    id: uuid("id").defaultRandom().primaryKey(),
    // Target identity (email/phone/user identifier).
    identifier: text("identifier").notNull(),
    // Verification value or token.
    value: text("value").notNull(),
    // Verification value expiration time.
    expiresAt: timestamp("expires_at").notNull(),
    // Record creation time.
    createdAt: timestamp("created_at").notNull().defaultNow(),
    // Record last update time.
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [
    index("verification_identifier_idx").on(t.identifier),
    uniqueIndex("verification_identifier_value_unique").on(
      t.identifier,
      t.value
    ),
  ]
);
