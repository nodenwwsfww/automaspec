PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_account` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`user_id` text NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`id_token` text,
	`access_token_expires_at` integer,
	`refresh_token_expires_at` integer,
	`scope` text,
	`password` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_account`("id", "account_id", "provider_id", "user_id", "access_token", "refresh_token", "id_token", "access_token_expires_at", "refresh_token_expires_at", "scope", "password", "created_at", "updated_at") SELECT "id", "account_id", "provider_id", "user_id", "access_token", "refresh_token", "id_token", "access_token_expires_at", "refresh_token_expires_at", "scope", "password", "created_at", "updated_at" FROM `account`;--> statement-breakpoint
DROP TABLE `account`;--> statement-breakpoint
ALTER TABLE `__new_account` RENAME TO `account`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_session` (
	`id` text PRIMARY KEY NOT NULL,
	`expires_at` integer NOT NULL,
	`token` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_session`("id", "expires_at", "token", "created_at", "updated_at", "ip_address", "user_agent", "user_id") SELECT "id", "expires_at", "token", "created_at", "updated_at", "ip_address", "user_agent", "user_id" FROM `session`;--> statement-breakpoint
DROP TABLE `session`;--> statement-breakpoint
ALTER TABLE `__new_session` RENAME TO `session`;--> statement-breakpoint
CREATE UNIQUE INDEX `session_token_unique` ON `session` (`token`);--> statement-breakpoint
CREATE TABLE `__new_test` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
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
CREATE TABLE `__new_test_requirement` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
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
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
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
ALTER TABLE `__new_test_spec` RENAME TO `test_spec`;--> statement-breakpoint
CREATE TABLE `__new_test_category` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
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
ALTER TABLE `__new_test_category` RENAME TO `test_category`;