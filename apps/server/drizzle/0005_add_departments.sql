CREATE TABLE "departments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"parent_id" uuid,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"manager_membership_id" uuid,
	"status" text DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "membership_departments" (
	"membership_id" uuid NOT NULL,
	"department_id" uuid NOT NULL,
	"is_primary" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "departments" ADD CONSTRAINT "departments_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "departments" ADD CONSTRAINT "departments_parent_id_departments_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."departments"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "departments" ADD CONSTRAINT "departments_manager_membership_id_memberships_id_fk" FOREIGN KEY ("manager_membership_id") REFERENCES "public"."memberships"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "membership_departments" ADD CONSTRAINT "membership_departments_membership_id_memberships_id_fk" FOREIGN KEY ("membership_id") REFERENCES "public"."memberships"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "membership_departments" ADD CONSTRAINT "membership_departments_department_id_departments_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
CREATE UNIQUE INDEX "departments_company_code_unique" ON "departments" USING btree ("company_id","code");
--> statement-breakpoint
CREATE INDEX "departments_company_status_idx" ON "departments" USING btree ("company_id","status");
--> statement-breakpoint
CREATE INDEX "departments_parent_idx" ON "departments" USING btree ("parent_id");
--> statement-breakpoint
CREATE UNIQUE INDEX "membership_departments_unique" ON "membership_departments" USING btree ("membership_id","department_id");
--> statement-breakpoint
CREATE INDEX "membership_departments_membership_idx" ON "membership_departments" USING btree ("membership_id");
--> statement-breakpoint
CREATE INDEX "membership_departments_department_idx" ON "membership_departments" USING btree ("department_id");