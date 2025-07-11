ALTER TABLE `test_categories` RENAME TO `test_category`;--> statement-breakpoint
ALTER TABLE `test_group` RENAME TO `test_spec`;--> statement-breakpoint
ALTER TABLE `test_category` RENAME COLUMN "parent_id" TO "parent_category_id";--> statement-breakpoint
ALTER TABLE `test_spec` RENAME COLUMN "test_categories_id" TO "test_category_id";--> statement-breakpoint
DROP INDEX "session_token_unique";--> statement-breakpoint
DROP INDEX "user_email_unique";--> statement-breakpoint
ALTER TABLE `test_category` ALTER COLUMN "title" TO "title" text;--> statement-breakpoint
CREATE UNIQUE INDEX `session_token_unique` ON `session` (`token`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
ALTER TABLE `test_category` ADD `name` text NOT NULL;--> statement-breakpoint
ALTER TABLE `test_category` ADD `description` text;--> statement-breakpoint
ALTER TABLE `test_spec` ALTER COLUMN "title" TO "title" text;--> statement-breakpoint
ALTER TABLE `test_spec` ADD `name` text NOT NULL;--> statement-breakpoint
ALTER TABLE `test_spec` ALTER COLUMN "test_category_id" TO "test_category_id" text NOT NULL REFERENCES test_category(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `test_spec` DROP COLUMN `code_template`;--> statement-breakpoint
ALTER TABLE `test` ADD `code` text;--> statement-breakpoint
ALTER TABLE `test` ADD `test_requirement_id` text NOT NULL REFERENCES test_requirement(id);--> statement-breakpoint
ALTER TABLE `test` DROP COLUMN `title`;--> statement-breakpoint
ALTER TABLE `test` DROP COLUMN `description`;--> statement-breakpoint
ALTER TABLE `test` DROP COLUMN `actual_result`;--> statement-breakpoint
ALTER TABLE `test` DROP COLUMN `expected_result`;--> statement-breakpoint
ALTER TABLE `test` DROP COLUMN `playwright_code`;--> statement-breakpoint
ALTER TABLE `test` DROP COLUMN `test_group_id`;--> statement-breakpoint
ALTER TABLE `test_requirement` ADD `description` text;--> statement-breakpoint
ALTER TABLE `test_requirement` ADD `test_spec_id` text NOT NULL REFERENCES test_spec(id);--> statement-breakpoint
ALTER TABLE `test_requirement` DROP COLUMN `status`;--> statement-breakpoint
ALTER TABLE `test_requirement` DROP COLUMN `test_id`;