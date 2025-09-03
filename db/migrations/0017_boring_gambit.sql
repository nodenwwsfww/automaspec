PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_test_category` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`title` text,
	`description` text,
	`parent_category_id` text,
	`organization_id` text,
	`order` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_test_category`("id", "name", "title", "description", "parent_category_id", "organization_id", "order", "created_at", "updated_at") SELECT "id", "name", "title", "description", "parent_category_id", "organization_id", "order", "created_at", "updated_at" FROM `test_category`;--> statement-breakpoint
DROP TABLE `test_category`;--> statement-breakpoint
ALTER TABLE `__new_test_category` RENAME TO `test_category`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
DROP INDEX "organization_slug_unique";--> statement-breakpoint
DROP INDEX "session_token_unique";--> statement-breakpoint
DROP INDEX "user_email_unique";--> statement-breakpoint
ALTER TABLE `test_spec` ALTER COLUMN "status" TO "status" text NOT NULL DEFAULT 'todo';--> statement-breakpoint
CREATE UNIQUE INDEX `organization_slug_unique` ON `organization` (`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `session_token_unique` ON `session` (`token`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);