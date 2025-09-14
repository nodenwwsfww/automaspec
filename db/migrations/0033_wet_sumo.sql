ALTER TABLE `test_category` RENAME TO `test_folder`;--> statement-breakpoint
ALTER TABLE `test_spec` RENAME COLUMN "test_category_id" TO "test_folder_id";--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_test_folder` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`parent_category_id` text,
	`organization_id` text NOT NULL,
	`order` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_test_folder`("id", "name", "description", "parent_category_id", "organization_id", "order", "created_at", "updated_at") SELECT "id", "name", "description", "parent_category_id", "organization_id", "order", "created_at", "updated_at" FROM `test_folder`;--> statement-breakpoint
DROP TABLE `test_folder`;--> statement-breakpoint
ALTER TABLE `__new_test_folder` RENAME TO `test_folder`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
ALTER TABLE `test_spec` ALTER COLUMN "test_folder_id" TO "test_folder_id" text REFERENCES test_folder(id) ON DELETE cascade ON UPDATE no action;