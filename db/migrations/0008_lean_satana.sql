DROP INDEX "session_token_unique";--> statement-breakpoint
DROP INDEX "user_email_unique";--> statement-breakpoint
ALTER TABLE `test` ALTER COLUMN "created_at" TO "created_at" integer NOT NULL DEFAULT (CURRENT_TIMESTAMP);--> statement-breakpoint
CREATE UNIQUE INDEX `session_token_unique` ON `session` (`token`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
ALTER TABLE `test` ALTER COLUMN "updated_at" TO "updated_at" integer NOT NULL DEFAULT (CURRENT_TIMESTAMP);--> statement-breakpoint
ALTER TABLE `test_category` ALTER COLUMN "created_at" TO "created_at" integer NOT NULL DEFAULT (CURRENT_TIMESTAMP);--> statement-breakpoint
ALTER TABLE `test_category` ALTER COLUMN "updated_at" TO "updated_at" integer NOT NULL DEFAULT (CURRENT_TIMESTAMP);--> statement-breakpoint
ALTER TABLE `test_requirement` ALTER COLUMN "created_at" TO "created_at" integer NOT NULL DEFAULT (CURRENT_TIMESTAMP);--> statement-breakpoint
ALTER TABLE `test_requirement` ALTER COLUMN "updated_at" TO "updated_at" integer NOT NULL DEFAULT (CURRENT_TIMESTAMP);--> statement-breakpoint
ALTER TABLE `test_spec` ALTER COLUMN "created_at" TO "created_at" integer NOT NULL DEFAULT (CURRENT_TIMESTAMP);--> statement-breakpoint
ALTER TABLE `test_spec` ALTER COLUMN "updated_at" TO "updated_at" integer NOT NULL DEFAULT (CURRENT_TIMESTAMP);