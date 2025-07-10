import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { relations } from 'drizzle-orm'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'

export const testCategory = sqliteTable('test_category', {
    id: text('id').primaryKey(),
    title: text('title').notNull(),
    parentId: text('parent_id'),
    order: integer('order').notNull().default(0),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
})
export const testCategoryInsertSchema = createInsertSchema(testCategory)

export const testGroup = sqliteTable('test_group', {
    id: text('id').primaryKey(),
    title: text('title').notNull(),
    description: text('description'),
    testCategoryId: text('test_category_id')
        .notNull()
        .references(() => testCategory.id),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
})
export const testGroupInsertSchema = createInsertSchema(testGroup)

export const testRequirement = sqliteTable('test_requirement', {
    id: text('id').primaryKey(),
    text: text('text').notNull(),
    order: integer('order').notNull().default(0),
    testGroupId: text('test_group_id')
        .notNull()
        .references(() => testGroup.id),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
})

export const test = sqliteTable('test', {
    id: text('id').primaryKey(),
    status: text('status').notNull().default('pending'),
    framework: text('framework').default('Playwright'),
    code: text('code'),
    testRequirementId: text('test_requirement_id')
        .notNull()
        .references(() => testRequirement.id),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
})
export const testInsertSchema = createInsertSchema(test)

export const testCategoryRelations = relations(testCategory, ({ one, many }) => ({
    parent: one(testCategory, {
        fields: [testCategory.parentId],
        references: [testCategory.id]
    }),
    children: many(testCategory),
    testGroups: many(testGroup)
}))

export const testGroupRelations = relations(testGroup, ({ one, many }) => ({
    category: one(testCategory, {
        fields: [testGroup.testCategoryId],
        references: [testCategory.id]
    }),
    requirements: many(testRequirement)
}))

export const testRequirementRelations = relations(testRequirement, ({ one, many }) => ({
    group: one(testGroup, {
        fields: [testRequirement.testGroupId],
        references: [testGroup.id]
    }),
    tests: many(test)
}))

export const testRelations = relations(test, ({ one }) => ({
    requirement: one(testRequirement, {
        fields: [test.testRequirementId],
        references: [testRequirement.id]
    })
}))
