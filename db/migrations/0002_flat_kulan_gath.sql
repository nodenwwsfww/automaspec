CREATE TABLE `test_requirement` (
	`id` text PRIMARY KEY NOT NULL,
	`text` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`order` integer DEFAULT 0 NOT NULL,
	`test_id` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`test_id`) REFERENCES `test`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
ALTER TABLE `test` ADD `framework` text DEFAULT 'Vitest';--> statement-breakpoint
ALTER TABLE `test` ADD `playwright_code` text;