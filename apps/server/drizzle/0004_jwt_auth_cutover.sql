ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "name" text;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "password_hash" text;

UPDATE "users"
SET "name" = "username"
WHERE "name" IS NULL;

DO $$
BEGIN
	IF EXISTS (
		SELECT 1
		FROM information_schema.tables
		WHERE table_schema = 'public' AND table_name = 'accounts'
	) THEN
		UPDATE "users" AS u
		SET "password_hash" = a."password"
		FROM (
			SELECT DISTINCT ON ("user_id")
				"user_id",
				"password",
				"updated_at"
			FROM "accounts"
			WHERE "provider_id" = 'credential' AND "password" IS NOT NULL
			ORDER BY "user_id", "updated_at" DESC
		) AS a
		WHERE u."id" = a."user_id" AND u."password_hash" IS NULL;
	END IF;
END
$$;

CREATE TABLE IF NOT EXISTS "refresh_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token_hash" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"revoked_at" timestamp,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "refresh_tokens"
ADD CONSTRAINT "refresh_tokens_user_id_users_id_fk"
FOREIGN KEY ("user_id") REFERENCES "public"."users"("id")
ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "refresh_token_hash_unique" ON "refresh_tokens" USING btree ("token_hash");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "refresh_token_user_id_idx" ON "refresh_tokens" USING btree ("user_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "refresh_token_expires_at_idx" ON "refresh_tokens" USING btree ("expires_at");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "refresh_token_revoked_at_idx" ON "refresh_tokens" USING btree ("revoked_at");
