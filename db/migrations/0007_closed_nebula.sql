PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_test` (
	`id` text PRIMARY KEY NOT NULL,
	`status` text DEFAULT 'pending',
	`framework` text DEFAULT 'Playwright',
	`code` text,
	`test_requirement_id` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`test_requirement_id`) REFERENCES `test_requirement`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_test`("id", "status", "framework", "code", "test_requirement_id", "created_at", "updated_at") SELECT "id", "status", "framework", "code", "test_requirement_id", "created_at", "updated_at" FROM `test`;--> statement-breakpoint
DROP TABLE `test`;--> statement-breakpoint
ALTER TABLE `__new_test` RENAME TO `test`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
DROP INDEX "session_token_unique";--> statement-breakpoint
DROP INDEX "user_email_unique";--> statement-breakpoint
ALTER TABLE `test_category` ALTER COLUMN "parent_category_id" TO "parent_category_id" text;--> statement-breakpoint
CREATE UNIQUE INDEX `session_token_unique` ON `session` (`token`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
ALTER TABLE `test_category` ALTER COLUMN "created_at" TO "created_at" integer NOT NULL DEFAULT (unixepoch() * 1000);--> statement-breakpoint
ALTER TABLE `test_category` ALTER COLUMN "updated_at" TO "updated_at" integer NOT NULL DEFAULT (unixepoch() * 1000);--> statement-breakpoint
CREATE TABLE `__new_test_requirement` (
	`id` text PRIMARY KEY NOT NULL,
	`text` text NOT NULL,
	`description` text,
	`order` integer DEFAULT 0 NOT NULL,
	`test_spec_id` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`test_spec_id`) REFERENCES `test_spec`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_test_requirement`("id", "text", "description", "order", "test_spec_id", "created_at", "updated_at") SELECT "id", "text", "description", "order", "test_spec_id", "created_at", "updated_at" FROM `test_requirement`;--> statement-breakpoint
DROP TABLE `test_requirement`;--> statement-breakpoint
ALTER TABLE `__new_test_requirement` RENAME TO `test_requirement`;--> statement-breakpoint
CREATE TABLE `__new_test_spec` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`title` text,
	`description` text,
	`test_category_id` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`test_category_id`) REFERENCES `test_category`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_test_spec`("id", "name", "title", "description", "test_category_id", "created_at", "updated_at") SELECT "id", "name", "title", "description", "test_category_id", "created_at", "updated_at" FROM `test_spec`;--> statement-breakpoint
DROP TABLE `test_spec`;--> statement-breakpoint
ALTER TABLE `__new_test_spec` RENAME TO `test_spec`;