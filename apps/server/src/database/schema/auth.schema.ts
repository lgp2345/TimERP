import {
  boolean,
  index,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

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
    // Bcrypt password hash used for local credential login.
    passwordHash: text("password_hash"),
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

// Stores external/provider account bindings for a user.
export const accounts = pgTable(
  "accounts",
  {
    // Primary key for the account record.
    id: uuid("id").defaultRandom().primaryKey(),
    // Provider-side unique account identifier.
    accountId: text("account_id").notNull(),
    // Auth provider identifier (for example: credential, google, github).
    providerId: text("provider_id").notNull(),
    // User that owns this account binding.
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    // Provider access token.
    accessToken: text("access_token"),
    // Provider refresh token.
    refreshToken: text("refresh_token"),
    // Provider id token.
    idToken: text("id_token"),
    // Access token expiration timestamp.
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    // Refresh token expiration timestamp.
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    // Authorized scope string from provider.
    scope: text("scope"),
    // Credential password hash (kept for migration compatibility).
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

// Stores refresh tokens used for JWT rotation and revocation.
export const refreshTokens = pgTable(
  "refresh_tokens",
  {
    // Primary key for the refresh token record.
    id: uuid("id").defaultRandom().primaryKey(),
    // User that owns the token.
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    // SHA256 hash of refresh token value.
    tokenHash: text("token_hash").notNull(),
    // Token expiration timestamp.
    expiresAt: timestamp("expires_at").notNull(),
    // Token revocation timestamp.
    revokedAt: timestamp("revoked_at"),
    // Client IP when token is issued.
    ipAddress: text("ip_address"),
    // Client user-agent when token is issued.
    userAgent: text("user_agent"),
    // Record creation time.
    createdAt: timestamp("created_at").notNull().defaultNow(),
    // Record last update time.
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("refresh_token_hash_unique").on(t.tokenHash),
    index("refresh_token_user_id_idx").on(t.userId),
    index("refresh_token_expires_at_idx").on(t.expiresAt),
    index("refresh_token_revoked_at_idx").on(t.revokedAt),
  ]
);
