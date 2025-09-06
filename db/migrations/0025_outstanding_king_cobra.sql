PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_test_spec` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`file_name` text,
	`description` text,
	`status` text NOT NULL,
	`test_category_id` text,
	`organization_id` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`test_category_id`) REFERENCES `test_category`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_test_spec`("id", "name", "file_name", "description", "status", "test_category_id", "organization_id", "created_at", "updated_at") SELECT "id", "name", "file_name", "description", "status", "test_category_id", "organization_id", "created_at", "updated_at" FROM `test_spec`;--> statement-breakpoint
DROP TABLE `test_spec`;--> statement-breakpoint
ALTER TABLE `__new_test_spec` RENAME TO `test_spec`;--> statement-breakpoint
PRAGMA foreign_keys=ON;