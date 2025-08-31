import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { relations, sql } from 'drizzle-orm'
import { createInsertSchema } from 'drizzle-zod'
import { TestFramework, TestStatus, SpecStatus } from '@/lib/types'
import { organization } from './auth'

export const testCategory = sqliteTable('test_category', {
    id: text().primaryKey(),
    name: text().notNull(),
    title: text(),
    description: text(),
    parentCategoryId: text(),
    organizationId: text().references(() => organization.id, { onDelete: 'cascade' }),
    order: integer().notNull().default(0),
    createdAt: integer({ mode: 'timestamp' })
        .notNull()
        .default(sql`(CURRENT_TIMESTAMP)`),
    updatedAt: integer({ mode: 'timestamp' })
        .notNull()
        .default(sql`(CURRENT_TIMESTAMP)`)
        .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`)
})
export const testCategoryInsertSchema = createInsertSchema(testCategory)

export const testSpec = sqliteTable('test_spec', {
    id: text().primaryKey(),
    name: text().notNull(),
    title: text(),
    description: text(),
    status: text().$type<SpecStatus>().default('default').notNull(),
    testCategoryId: text()
        .notNull()
        .references(() => testCategory.id, { onDelete: 'cascade' }),
    createdAt: integer({ mode: 'timestamp' })
        .notNull()
        .default(sql`(CURRENT_TIMESTAMP)`),
    updatedAt: integer({ mode: 'timestamp' })
        .notNull()
        .default(sql`(CURRENT_TIMESTAMP)`)
        .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`)
})
export const testSpecInsertSchema = createInsertSchema(testSpec)

export const testRequirement = sqliteTable('test_requirement', {
    id: text().primaryKey(),
    text: text().notNull(),
    description: text(),
    order: integer().notNull().default(0),
    testSpecId: text()
        .notNull()
        .references(() => testSpec.id, { onDelete: 'cascade' }),
    createdAt: integer({ mode: 'timestamp' })
        .notNull()
        .default(sql`(CURRENT_TIMESTAMP)`),
    updatedAt: integer({ mode: 'timestamp' })
        .notNull()
        .default(sql`(CURRENT_TIMESTAMP)`)
        .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`)
})
export const testRequirementInsertSchema = createInsertSchema(testRequirement)

export const test = sqliteTable('test', {
    id: text().primaryKey(),
    status: text().$type<TestStatus>().default('todo').notNull(),
    framework: text().$type<TestFramework>().default('vitest'),
    code: text(),
    testRequirementId: text()
        .notNull()
        .references(() => testRequirement.id, { onDelete: 'cascade' }),
    createdAt: integer({ mode: 'timestamp' })
        .notNull()
        .default(sql`(CURRENT_TIMESTAMP)`),
    updatedAt: integer({ mode: 'timestamp' })
        .notNull()
        .default(sql`(CURRENT_TIMESTAMP)`)
        .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`)
})
export const testInsertSchema = createInsertSchema(test)

export const testCategoryRelations = relations(testCategory, ({ one, many }) => ({
    parent: one(testCategory, {
        fields: [testCategory.parentCategoryId],
        references: [testCategory.id]
    }),
    organization: one(organization, {
        fields: [testCategory.organizationId],
        references: [organization.id]
    }),
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
