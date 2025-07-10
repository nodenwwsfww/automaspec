import { relations } from 'drizzle-orm/relations'
import { user, account, session, testGroup, test, testCategories, testRequirement } from './schema'

export const accountRelations = relations(account, ({ one }) => ({
    user: one(user, {
        fields: [account.userId],
        references: [user.id]
    })
}))

export const userRelations = relations(user, ({ many }) => ({
    accounts: many(account),
    sessions: many(session)
}))

export const sessionRelations = relations(session, ({ one }) => ({
    user: one(user, {
        fields: [session.userId],
        references: [user.id]
    })
}))

export const testRelations = relations(test, ({ one, many }) => ({
    testGroup: one(testGroup, {
        fields: [test.testGroupId],
        references: [testGroup.id]
    }),
    testRequirements: many(testRequirement)
}))

export const testGroupRelations = relations(testGroup, ({ one, many }) => ({
    tests: many(test),
    testCategory: one(testCategories, {
        fields: [testGroup.testCategoriesId],
        references: [testCategories.id]
    })
}))

export const testCategoriesRelations = relations(testCategories, ({ many }) => ({
    testGroups: many(testGroup)
}))

export const testRequirementRelations = relations(testRequirement, ({ one }) => ({
    test: one(test, {
        fields: [testRequirement.testId],
        references: [test.id]
    })
}))
