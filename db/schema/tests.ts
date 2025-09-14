import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { relations, sql } from 'drizzle-orm'
import { TestFramework, SpecStatus, TestStatus } from '@/lib/types'
import { organization } from './auth'

export const testFolder = sqliteTable('test_folder', {
    id: text().primaryKey(),
    name: text().notNull(),
    description: text(),
    parentCategoryId: text(),
    organizationId: text()
        .references(() => organization.id, { onDelete: 'cascade' })
        .notNull(),
    order: integer().notNull().default(0),
    createdAt: text()
        .notNull()
        .default(sql`(CURRENT_TIMESTAMP)`),
    updatedAt: text()
        .notNull()
        .default(sql`(CURRENT_TIMESTAMP)`)
        .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`)
})

export const testSpec = sqliteTable('test_spec', {
    id: text().primaryKey(),
    name: text().notNull(),
    fileName: text(),
    description: text(),
    // TODO: add enum
    status: text().$type<SpecStatus>().notNull(),
    allTestCount: integer().notNull().default(0),
    succeededTestCount: integer().notNull().default(0),
    testFolderId: text().references(() => testFolder.id, { onDelete: 'cascade' }),
    organizationId: text()
        .references(() => organization.id, { onDelete: 'cascade' })
        .notNull(),
    createdAt: text()
        .notNull()
        .default(sql`(CURRENT_TIMESTAMP)`),
    updatedAt: text()
        .notNull()
        .default(sql`(CURRENT_TIMESTAMP)`)
        .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`)
})

export const testRequirement = sqliteTable('test_requirement', {
    id: text().primaryKey(),
    name: text().notNull(),
    description: text(),
    order: integer().notNull().default(0),
    testSpecId: text()
        .notNull()
        .references(() => testSpec.id, { onDelete: 'cascade' }),
    createdAt: text()
        .notNull()
        .default(sql`(CURRENT_TIMESTAMP)`),
    updatedAt: text()
        .notNull()
        .default(sql`(CURRENT_TIMESTAMP)`)
        .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`)
})

export const test = sqliteTable('test', {
    id: text().primaryKey(),
    status: text().$type<TestStatus>().notNull(),
    framework: text().$type<TestFramework>().notNull(),
    code: text(),
    testRequirementId: text()
        .notNull()
        .references(() => testRequirement.id, { onDelete: 'cascade' }),
    createdAt: text()
        .notNull()
        .default(sql`(CURRENT_TIMESTAMP)`),
    updatedAt: text()
        .notNull()
        .default(sql`(CURRENT_TIMESTAMP)`)
        .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`)
})

export const testFolderRelations = relations(testFolder, ({ one, many }) => ({
    parent: one(testFolder, {
        fields: [testFolder.parentCategoryId],
        references: [testFolder.id]
    }),
    organization: one(organization, {
        fields: [testFolder.organizationId],
        references: [organization.id]
    }),
    testSpecs: many(testSpec)
}))

export const testSpecRelations = relations(testSpec, ({ one, many }) => ({
    folder: one(testFolder, {
        fields: [testSpec.testFolderId],
        references: [testFolder.id]
    }),
    organization: one(organization, {
        fields: [testSpec.organizationId],
        references: [organization.id]
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
