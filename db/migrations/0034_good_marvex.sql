ALTER TABLE `test` RENAME COLUMN "test_requirement_id" TO "requirement_id";--> statement-breakpoint
ALTER TABLE `test_folder` RENAME COLUMN "parent_category_id" TO "parent_folder_id";--> statement-breakpoint
ALTER TABLE `test_requirement` RENAME COLUMN "test_spec_id" TO "spec_id";--> statement-breakpoint
ALTER TABLE `test_spec` RENAME COLUMN "all_test_count" TO "number_of_tests";--> statement-breakpoint
ALTER TABLE `test_spec` RENAME COLUMN "test_folder_id" TO "folder_id";--> statement-breakpoint
ALTER TABLE `test` ALTER COLUMN "requirement_id" TO "requirement_id" text NOT NULL REFERENCES test_requirement(id) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `test_requirement` ALTER COLUMN "spec_id" TO "spec_id" text NOT NULL REFERENCES test_spec(id) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `test_spec` ADD `statuses` text DEFAULT '{"passed":0,"skipped":0,"todo":0,"failed":0,"pending":0,"disabled":0,"missing":0,"deactivated":0,"partial":0}' NOT NULL;--> statement-breakpoint
ALTER TABLE `test_spec` ALTER COLUMN "folder_id" TO "folder_id" text REFERENCES test_folder(id) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `test_spec` DROP COLUMN `status`;--> statement-breakpoint
ALTER TABLE `test_spec` DROP COLUMN `succeeded_test_count`;