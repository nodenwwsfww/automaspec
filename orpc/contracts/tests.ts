import { oc } from '@orpc/contract'
import * as z from 'zod'
import {
    testFolderSelectSchema,
    testFolderInsertSchema,
    testSpecSelectSchema,
    testSpecInsertSchema,
    testRequirementSelectSchema,
    testRequirementInsertSchema,
    testSelectSchema,
    testInsertSchema
} from '@/lib/types'

const listTestCategoriesContract = oc
    .route({ method: 'GET', path: '/test-categories' })
    .input(testFolderInsertSchema.pick({ parentCategoryId: true }).partial({ parentCategoryId: true }))
    .output(z.array(testFolderSelectSchema))

const upsertTestCategoryContract = oc
    .route({ method: 'POST', path: '/test-categories/{id}' })
    .input(testFolderInsertSchema.omit({ createdAt: true, updatedAt: true }).partial({ id: true }))
    .output(testFolderInsertSchema)

const deleteTestCategoryContract = oc
    .route({ method: 'DELETE', path: '/test-categories/{id}' })
    .input(testFolderInsertSchema.pick({ id: true }))
    .output(z.object({ success: z.boolean() }))

const listTestSpecsContract = oc
    .route({ method: 'GET', path: '/test-specs' })
    .input(testSpecInsertSchema.pick({ testFolderId: true }))
    .output(z.array(testSpecSelectSchema))

const upsertTestSpecContract = oc
    .route({ method: 'PUT', path: '/test-specs/{id}' })
    .input(testSpecInsertSchema.omit({ createdAt: true, updatedAt: true }))
    .output(testSpecInsertSchema)

const deleteTestSpecContract = oc
    .route({ method: 'DELETE', path: '/test-specs/{id}' })
    .input(testSpecInsertSchema.pick({ id: true }))
    .output(z.object({ success: z.boolean() }))

const listTestRequirementsContract = oc
    .route({ method: 'GET', path: '/test-requirements' })
    .input(testRequirementInsertSchema.pick({ testSpecId: true }))
    .output(z.array(testRequirementSelectSchema))

const upsertTestRequirementContract = oc
    .route({ method: 'PUT', path: '/test-requirements/{id}' })
    .input(testRequirementInsertSchema.omit({ createdAt: true, updatedAt: true }))
    .output(testRequirementInsertSchema)

const deleteTestRequirementContract = oc
    .route({ method: 'DELETE', path: '/test-requirements/{id}' })
    .input(testRequirementInsertSchema.pick({ id: true }))
    .output(z.object({ success: z.boolean() }))

const listTestsContract = oc
    .route({ method: 'GET', path: '/tests' })
    .input(testInsertSchema.pick({ testRequirementId: true }))
    .output(z.array(testSelectSchema))

const upsertTestContract = oc
    .route({ method: 'PUT', path: '/tests/{id}' })
    .input(testInsertSchema.omit({ createdAt: true, updatedAt: true }))
    .output(testInsertSchema)

const deleteTestContract = oc
    .route({ method: 'DELETE', path: '/tests/{id}' })
    .input(testInsertSchema.pick({ id: true }))
    .output(z.object({ success: z.boolean() }))

export const testsContract = {
    testCategories: {
        list: listTestCategoriesContract,
        upsert: upsertTestCategoryContract,
        delete: deleteTestCategoryContract
    },
    testSpecs: {
        list: listTestSpecsContract,
        upsert: upsertTestSpecContract,
        delete: deleteTestSpecContract
    },
    testRequirements: {
        list: listTestRequirementsContract,
        upsert: upsertTestRequirementContract,
        delete: deleteTestRequirementContract
    },
    tests: {
        list: listTestsContract,
        upsert: upsertTestContract,
        delete: deleteTestContract
    }
}
