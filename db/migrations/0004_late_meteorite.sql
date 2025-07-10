ALTER TABLE `test` ADD `code` text;--> statement-breakpoint
ALTER TABLE `test` DROP COLUMN `actual_result`;--> statement-breakpoint
ALTER TABLE `test` DROP COLUMN `expected_result`;--> statement-breakpoint
ALTER TABLE `test` DROP COLUMN `playwright_code`;--> statement-breakpoint
ALTER TABLE `test_group` DROP COLUMN `code_template`;