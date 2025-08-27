-- Update existing records from 'skipped' to 'todo'
UPDATE `test` SET "status" = 'todo' WHERE "status" = 'skipped';
UPDATE `test_spec` SET "status" = 'todo' WHERE "status" = 'skipped';
