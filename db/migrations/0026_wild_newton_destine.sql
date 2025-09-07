DROP INDEX "organization_slug_unique";--> statement-breakpoint
DROP INDEX "session_token_unique";--> statement-breakpoint
DROP INDEX "user_email_unique";--> statement-breakpoint
ALTER TABLE `test` ALTER COLUMN "created_at" TO "created_at" integer NOT NULL DEFAULT (CURRENT_TIMESTAMP);--> statement-breakpoint
CREATE UNIQUE INDEX `organization_slug_unique` ON `organization` (`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `session_token_unique` ON `session` (`token`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
ALTER TABLE `test` ALTER COLUMN "updated_at" TO "updated_at" integer NOT NULL DEFAULT (CURRENT_TIMESTAMP);--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_test_category` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`parent_category_id` text,
	`organization_id` text NOT NULL,
	`order` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_test_category`("id", "name", "description", "parent_category_id", "organization_id", "order", "created_at", "updated_at") SELECT "id", "name", "description", "parent_category_id", "organization_id", "order", "created_at", "updated_at" FROM `test_category`;--> statement-breakpoint
DROP TABLE `test_category`;--> statement-breakpoint
ALTER TABLE `__new_test_category` RENAME TO `test_category`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
ALTER TABLE `test_requirement` ALTER COLUMN "created_at" TO "created_at" integer NOT NULL DEFAULT (CURRENT_TIMESTAMP);--> statement-breakpoint
ALTER TABLE `test_requirement` ALTER COLUMN "updated_at" TO "updated_at" integer NOT NULL DEFAULT (CURRENT_TIMESTAMP);--> statement-breakpoint
CREATE TABLE `__new_test_spec` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`file_name` text,
	`description` text,
	`status` text NOT NULL,
	`test_category_id` text,
	`organization_id` text NOT NULL,
	`created_at` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`test_category_id`) REFERENCES `test_category`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_test_spec`("id", "name", "file_name", "description", "status", "test_category_id", "organization_id", "created_at", "updated_at") SELECT "id", "name", "file_name", "description", "status", "test_category_id", "organization_id", "created_at", "updated_at" FROM `test_spec`;--> statement-breakpoint
DROP TABLE `test_spec`;--> statement-breakpoint
ALTER TABLE `__new_test_spec` RENAME TO `test_spec`;