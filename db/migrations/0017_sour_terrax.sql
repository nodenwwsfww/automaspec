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
ALTER TABLE `organization` ADD `plan` text DEFAULT 'free' NOT NULL;--> statement-breakpoint
PRAGMA foreign_keys=ON;