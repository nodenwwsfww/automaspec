PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_test` (
	`id` text PRIMARY KEY NOT NULL,
	`status` text DEFAULT 'pending',
	`framework` text DEFAULT 'Playwright',
	`code` text,
	`test_requirement_id` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`test_requirement_id`) REFERENCES `test_requirement`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_test`("id", "status", "framework", "code", "test_requirement_id", "created_at", "updated_at") SELECT "id", "status", "framework", "code", "test_requirement_id", "created_at", "updated_at" FROM `test`;--> statement-breakpoint
DROP TABLE `test`;--> statement-breakpoint
ALTER TABLE `__new_test` RENAME TO `test`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_test_category` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`title` text,
	`description` text,
	`parent_category_id` integer,
	`order` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_test_category`("id", "name", "title", "description", "parent_category_id", "order", "created_at", "updated_at") SELECT "id", "name", "title", "description", "parent_category_id", "order", "created_at", "updated_at" FROM `test_category`;--> statement-breakpoint
DROP TABLE `test_category`;--> statement-breakpoint
ALTER TABLE `__new_test_category` RENAME TO `test_category`;--> statement-breakpoint
CREATE TABLE `__new_test_requirement` (
	`id` text PRIMARY KEY NOT NULL,
	`text` text NOT NULL,
	`description` text,
	`order` integer DEFAULT 0 NOT NULL,
	`test_spec_id` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
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
	`test_category_id` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`test_category_id`) REFERENCES `test_category`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_test_spec`("id", "name", "title", "description", "test_category_id", "created_at", "updated_at") SELECT "id", "name", "title", "description", "test_category_id", "created_at", "updated_at" FROM `test_spec`;--> statement-breakpoint
DROP TABLE `test_spec`;--> statement-breakpoint
ALTER TABLE `__new_test_spec` RENAME TO `test_spec`;