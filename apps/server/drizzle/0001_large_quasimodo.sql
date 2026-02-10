ALTER TABLE "company" ADD COLUMN "status" text DEFAULT 'active' NOT NULL;--> statement-breakpoint
ALTER TABLE "company_domains" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "company_domains" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "membership" ADD COLUMN "member_no" text;--> statement-breakpoint
ALTER TABLE "membership" ADD COLUMN "title" text;--> statement-breakpoint
ALTER TABLE "membership" ADD COLUMN "joined_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "membership" ADD COLUMN "invited_by" uuid;--> statement-breakpoint
ALTER TABLE "membership" ADD COLUMN "deactivated_at" timestamp;--> statement-breakpoint
ALTER TABLE "permissions" ADD COLUMN "resource" text DEFAULT 'generic' NOT NULL;--> statement-breakpoint
ALTER TABLE "permissions" ADD COLUMN "action" text DEFAULT 'manage' NOT NULL;--> statement-breakpoint
ALTER TABLE "permissions" ADD COLUMN "effect" text DEFAULT 'allow' NOT NULL;--> statement-breakpoint
ALTER TABLE "roles" ADD COLUMN "code" text DEFAULT 'member' NOT NULL;--> statement-breakpoint
ALTER TABLE "roles" ADD COLUMN "is_system" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "session" ADD COLUMN "active_company_id" uuid;--> statement-breakpoint
ALTER TABLE "session" ADD COLUMN "active_membership_id" uuid;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "phone_verified" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "status" text DEFAULT 'active' NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "last_login_at" timestamp;--> statement-breakpoint
UPDATE "permissions"
SET
  "resource" = COALESCE(NULLIF(split_part("code", '.', 1), ''), 'generic'),
  "action" = COALESCE(NULLIF(split_part("code", '.', 2), ''), 'manage');--> statement-breakpoint
UPDATE "roles"
SET "code" = CONCAT('role_', substr(replace("id"::text, '-', ''), 1, 8))
WHERE "code" = 'member';--> statement-breakpoint
ALTER TABLE "membership" ADD CONSTRAINT "membership_invited_by_user_id_fk" FOREIGN KEY ("invited_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_active_company_id_company_id_fk" FOREIGN KEY ("active_company_id") REFERENCES "public"."company"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "membership_company_member_no_unique" ON "membership" USING btree ("company_id","member_no");--> statement-breakpoint
CREATE INDEX "membership_company_status_idx" ON "membership" USING btree ("company_id","status");--> statement-breakpoint
CREATE INDEX "membership_user_status_idx" ON "membership" USING btree ("user_id","status");--> statement-breakpoint
CREATE UNIQUE INDEX "roles_company_code_unique" ON "roles" USING btree ("company_id","code");--> statement-breakpoint
CREATE INDEX "session_active_company_idx" ON "session" USING btree ("active_company_id");--> statement-breakpoint
CREATE INDEX "session_active_membership_idx" ON "session" USING btree ("active_membership_id");