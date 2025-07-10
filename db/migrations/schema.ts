import { sqliteTable, AnySQLiteColumn, foreignKey, text, integer, uniqueIndex } from "drizzle-orm/sqlite-core"
  import { sql } from "drizzle-orm"

export const account = sqliteTable("account", {
	id: text().primaryKey().notNull(),
	accountId: text("account_id").notNull(),
	providerId: text("provider_id").notNull(),
	userId: text("user_id").notNull().references(() => user.id),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	idToken: text("id_token"),
	accessTokenExpiresAt: integer("access_token_expires_at"),
	refreshTokenExpiresAt: integer("refresh_token_expires_at"),
	scope: text(),
	password: text(),
	createdAt: integer("created_at").notNull(),
	updatedAt: integer("updated_at").notNull(),
});

export const session = sqliteTable("session", {
	id: text().primaryKey().notNull(),
	expiresAt: integer("expires_at").notNull(),
	token: text().notNull(),
	createdAt: integer("created_at").notNull(),
	updatedAt: integer("updated_at").notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	userId: text("user_id").notNull().references(() => user.id),
},
(table) => [
	uniqueIndex("session_token_unique").on(table.token),
]);

export const user = sqliteTable("user", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	email: text().notNull(),
	emailVerified: integer("email_verified").notNull(),
	image: text(),
	createdAt: integer("created_at").notNull(),
	updatedAt: integer("updated_at").notNull(),
},
(table) => [
	uniqueIndex("user_email_unique").on(table.email),
]);

export const verification = sqliteTable("verification", {
	id: text().primaryKey().notNull(),
	identifier: text().notNull(),
	value: text().notNull(),
	expiresAt: integer("expires_at").notNull(),
	createdAt: integer("created_at"),
	updatedAt: integer("updated_at"),
});

export const test = sqliteTable("test", {
	id: text().primaryKey().notNull(),
	title: text().notNull(),
	description: text(),
	status: text().default("pending").notNull(),
	actualResult: text("actual_result"),
	expectedResult: text("expected_result"),
	framework: text().default("Playwright"),
	testGroupId: text("test_group_id").notNull().references(() => testGroup.id),
	createdAt: integer("created_at").notNull(),
	updatedAt: integer("updated_at").notNull(),
	code: text(),
});

export const testCategories = sqliteTable("test_categories", {
	id: text().primaryKey().notNull(),
	title: text().notNull(),
	parentId: text("parent_id"),
	order: integer().default(0).notNull(),
	createdAt: integer("created_at").notNull(),
	updatedAt: integer("updated_at").notNull(),
});

export const testGroup = sqliteTable("test_group", {
	id: text().primaryKey().notNull(),
	title: text().notNull(),
	description: text(),
	testCategoriesId: text("test_categories_id").notNull().references(() => testCategories.id),
	createdAt: integer("created_at").notNull(),
	updatedAt: integer("updated_at").notNull(),
});

export const testRequirement = sqliteTable("test_requirement", {
	id: text().primaryKey().notNull(),
	text: text().notNull(),
	status: text().default("pending").notNull(),
	order: integer().default(0).notNull(),
	testId: text("test_id").notNull().references(() => test.id),
	createdAt: integer("created_at").notNull(),
	updatedAt: integer("updated_at").notNull(),
});

