import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { relations } from 'drizzle-orm'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'

export const testCategories = sqliteTable('test_categories', {
    id: text('id').primaryKey(),
    title: text('title').notNull(),
    parentId: text('parent_id'),
    order: integer('order').notNull().default(0),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
})
export const testCategoryInsertSchema = createInsertSchema(testCategories)

export const testGroup = sqliteTable('test_group', {
    id: text('id').primaryKey(),
    title: text('title').notNull(),
    description: text('description'),
    testCategoriesId: text('test_categories_id')
        .notNull()
        .references(() => testCategories.id),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
})
export const testGroupInsertSchema = createInsertSchema(testGroup)

export const test = sqliteTable('test', {
    id: text('id').primaryKey(),
    title: text('title').notNull(),
    status: text('status').notNull().default('pending'),
    framework: text('framework').default('Playwright'),
    code: text('code'),
    testGroupId: text('test_group_id')
        .notNull()
        .references(() => testGroup.id),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
})
export const testInsertSchema = createInsertSchema(test)

export const testRequirement = sqliteTable('test_requirement', {
    id: text('id').primaryKey(),
    text: text('text').notNull(),
    status: text('status').notNull().default('pending'),
    order: integer('order').notNull().default(0),
    testId: text('test_id')
        .notNull()
        .references(() => test.id),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
})

export const testCategoriesRelations = relations(testCategories, ({ one, many }) => ({
    parent: one(testCategories, {
        fields: [testCategories.parentId],
        references: [testCategories.id]
    }),
    children: many(testCategories),
    testGroups: many(testGroup)
}))

export const testGroupRelations = relations(testGroup, ({ one, many }) => ({
    category: one(testCategories, {
        fields: [testGroup.testCategoriesId],
        references: [testCategories.id]
    }),
    tests: many(test)
}))

export const testRelations = relations(test, ({ one, many }) => ({
    group: one(testGroup, {
        fields: [test.testGroupId],
        references: [testGroup.id]
    }),
    requirements: many(testRequirement)
}))

export const testRequirementRelations = relations(testRequirement, ({ one }) => ({
    test: one(test, {
        fields: [testRequirement.testId],
        references: [test.id]
    })
}))
