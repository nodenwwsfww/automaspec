import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { relations, sql } from 'drizzle-orm'
import { TestFramework, SpecStatus, TestStatus } from '@/lib/types'
import { organization } from './auth'
import { SPEC_STATUSES } from '@/lib/constants'

type SpecStatuses = Record<SpecStatus, number>

const DEFAULT_SPEC_STATUSES: SpecStatuses = Object.fromEntries(
    Object.values(SPEC_STATUSES).map((status: SpecStatus) => [status, 0])
) as SpecStatuses

export const test = sqliteTable('test', {
    id: text().primaryKey().notNull(),
    status: text().$type<TestStatus>().notNull(),
    framework: text().$type<TestFramework>().notNull(),
    code: text(),
    requirementId: text()
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

export const testFolder = sqliteTable('test_folder', {
    id: text().primaryKey().notNull(),
    name: text().notNull(),
    description: text(),
    parentFolderId: text().notNull().default('0'),
    organizationId: text()
        .notNull()
        .references(() => organization.id, { onDelete: 'cascade' }),
    order: integer().notNull().default(0),
    createdAt: text()
        .notNull()
        .default(sql`(CURRENT_TIMESTAMP)`),
    updatedAt: text()
        .notNull()
        .default(sql`(CURRENT_TIMESTAMP)`)
        .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`)
})

export const testRequirement = sqliteTable('test_requirement', {
    id: text().primaryKey().notNull(),
    name: text().notNull(),
    description: text(),
    order: integer().notNull().default(0),
    specId: text()
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

export const testSpec = sqliteTable('test_spec', {
    id: text().primaryKey().notNull(),
    name: text().notNull(),
    fileName: text('file_name'),
    description: text(),
    statuses: text({ mode: 'json' }).$type<SpecStatuses>().default(DEFAULT_SPEC_STATUSES).notNull(),
    numberOfTests: integer().notNull().default(0),
    folderId: text().references(() => testFolder.id, { onDelete: 'cascade' }),
    organizationId: text()
        .notNull()
        .references(() => organization.id, { onDelete: 'cascade' }),
    createdAt: text()
        .notNull()
        .default(sql`(CURRENT_TIMESTAMP)`),
    updatedAt: text()
        .notNull()
        .default(sql`(CURRENT_TIMESTAMP)`)
        .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`)
})

export const testRelations = relations(test, ({ one }) => ({
    testRequirement: one(testRequirement, {
        fields: [test.requirementId],
        references: [testRequirement.id]
    })
}))

export const testRequirementRelations = relations(testRequirement, ({ one, many }) => ({
    tests: many(test),
    testSpec: one(testSpec, {
        fields: [testRequirement.specId],
        references: [testSpec.id]
    })
}))

export const testFolderRelations = relations(testFolder, ({ one, many }) => ({
    organization: one(organization, {
        fields: [testFolder.organizationId],
        references: [organization.id]
    }),
    testSpecs: many(testSpec)
}))

export const testSpecRelations = relations(testSpec, ({ one, many }) => ({
    testRequirements: many(testRequirement),
    organization: one(organization, {
        fields: [testSpec.organizationId],
        references: [organization.id]
    }),
    testFolder: one(testFolder, {
        fields: [testSpec.folderId],
        references: [testFolder.id]
    })
}))
