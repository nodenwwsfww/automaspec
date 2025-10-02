ALTER TABLE `test` RENAME COLUMN "test_requirement_id" TO "requirement_id";--> statement-breakpoint
ALTER TABLE `test_requirement` RENAME COLUMN "test_spec_id" TO "spec_id";--> statement-breakpoint
ALTER TABLE `test_spec` RENAME COLUMN "all_test_count" TO "number_of_tests";--> statement-breakpoint
ALTER TABLE `test_spec` RENAME COLUMN "test_folder_id" TO "folder_id";--> statement-breakpoint
ALTER TABLE `test` ALTER COLUMN "requirement_id" TO "requirement_id" text NOT NULL REFERENCES test_requirement(id) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `test_requirement` ALTER COLUMN "spec_id" TO "spec_id" text NOT NULL REFERENCES test_spec(id) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `test_spec` ADD `statuses` text NOT NULL;--> statement-breakpoint
ALTER TABLE `test_spec` ALTER COLUMN "folder_id" TO "folder_id" text REFERENCES test_folder(id) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `test_spec` DROP COLUMN `status`;--> statement-breakpoint
ALTER TABLE `test_spec` DROP COLUMN `succeeded_test_count`;