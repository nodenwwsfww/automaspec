import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { relations } from 'drizzle-orm'
import { createInsertSchema } from 'drizzle-zod'

export const testCategory = sqliteTable('test_category', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    title: text('title'),
    description: text('description'),
    parentCategoryId: text('parent_category_id'),
    order: integer('order').notNull().default(0),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
})
export const testCategoryInsertSchema = createInsertSchema(testCategory)

export const testSpec = sqliteTable('test_spec', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    title: text('title'),
    description: text('description'),
    testCategoryId: text('test_category_id')
        .notNull()
        .references(() => testCategory.id),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
})
export const testSpecInsertSchema = createInsertSchema(testSpec)

export const testRequirement = sqliteTable('test_requirement', {
    id: text('id').primaryKey(),
    text: text('text').notNull(),
    description: text('description'),
    order: integer('order').notNull().default(0),
    testSpecId: text('test_spec_id')
        .notNull()
        .references(() => testSpec.id),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
})
export const testRequirementInsertSchema = createInsertSchema(testRequirement)

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
        fields: [testCategory.parentCategoryId],
        references: [testCategory.id]
    }),
    children: many(testCategory),
    testSpecs: many(testSpec)
}))

export const testSpecRelations = relations(testSpec, ({ one, many }) => ({
    category: one(testCategory, {
        fields: [testSpec.testCategoryId],
        references: [testCategory.id]
    }),
    requirements: many(testRequirement)
}))

export const testRequirementRelations = relations(testRequirement, ({ one, many }) => ({
    spec: one(testSpec, {
        fields: [testRequirement.testSpecId],
        references: [testSpec.id]
    }),
    tests: many(test)
}))

export const testRelations = relations(test, ({ one }) => ({
    requirement: one(testRequirement, {
        fields: [test.testRequirementId],
        references: [testRequirement.id]
    })
}))
