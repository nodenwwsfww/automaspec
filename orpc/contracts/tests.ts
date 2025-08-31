import { oc } from '@orpc/contract'
import * as z from 'zod'
import {
    testCategoryInsertSchema,
    testSpecInsertSchema,
    testInsertSchema,
    testRequirementInsertSchema
} from '@/db/schema'

// Test Categories contracts
const listTestCategoriesContract = oc
    .route({ method: 'GET', path: '/test-categories' })
    .input(z.object({ parentId: z.string().optional() }))
    .output(z.array(testCategoryInsertSchema))

const createTestCategoryContract = oc
    .route({ method: 'POST', path: '/test-categories' })
    .input(testCategoryInsertSchema.omit({ id: true, createdAt: true, updatedAt: true, organizationId: true }))
    .output(testCategoryInsertSchema)

const updateTestCategoryContract = oc
    .route({ method: 'PUT', path: '/test-categories/{id}' })
    .input(
        testCategoryInsertSchema
            .pick({ id: true })
            .and(
                testCategoryInsertSchema
                    .omit({ id: true, createdAt: true, updatedAt: true, organizationId: true })
                    .partial()
            )
    )
    .output(testCategoryInsertSchema)

const deleteTestCategoryContract = oc
    .route({ method: 'DELETE', path: '/test-categories/{id}' })
    .input(testCategoryInsertSchema.pick({ id: true }))
    .output(z.object({ success: z.boolean() }))

// Test Specs contracts
const listTestSpecsContract = oc
    .route({ method: 'GET', path: '/test-specs' })
    .input(z.object({ testCategoriesId: z.string().optional() }))
    .output(z.array(testSpecInsertSchema))

const createTestSpecContract = oc
    .route({ method: 'POST', path: '/test-specs' })
    .input(testSpecInsertSchema.omit({ id: true, createdAt: true, updatedAt: true }))
    .output(testSpecInsertSchema)

const updateTestSpecContract = oc
    .route({ method: 'PUT', path: '/test-specs/{id}' })
    .input(
        testSpecInsertSchema
            .pick({ id: true })
            .and(testSpecInsertSchema.omit({ id: true, createdAt: true, updatedAt: true }).partial())
    )
    .output(testSpecInsertSchema)

const deleteTestSpecContract = oc
    .route({ method: 'DELETE', path: '/test-specs/{id}' })
    .input(testSpecInsertSchema.pick({ id: true }))
    .output(z.object({ success: z.boolean() }))

// Test Requirements contracts
const listTestRequirementsContract = oc
    .route({ method: 'GET', path: '/test-requirements' })
    .input(z.object({ testGroupId: z.string().optional() }))
    .output(z.array(testRequirementInsertSchema))

const createTestRequirementContract = oc
    .route({ method: 'POST', path: '/test-requirements' })
    .input(testRequirementInsertSchema.omit({ id: true, createdAt: true, updatedAt: true }))
    .output(testRequirementInsertSchema)

const updateTestRequirementContract = oc
    .route({ method: 'PUT', path: '/test-requirements/{id}' })
    .input(
        testRequirementInsertSchema
            .pick({ id: true })
            .and(testRequirementInsertSchema.omit({ id: true, createdAt: true, updatedAt: true }).partial())
    )
    .output(testRequirementInsertSchema)

const deleteTestRequirementContract = oc
    .route({ method: 'DELETE', path: '/test-requirements/{id}' })
    .input(testRequirementInsertSchema.pick({ id: true }))
    .output(z.object({ success: z.boolean() }))

// Tests contracts
const listTestsContract = oc
    .route({ method: 'GET', path: '/tests' })
    .input(z.object({ testRequirementId: z.string().optional() }))
    .output(z.array(testInsertSchema))

const createTestContract = oc
    .route({ method: 'POST', path: '/tests' })
    .input(testInsertSchema.omit({ id: true, createdAt: true, updatedAt: true }))
    .output(testInsertSchema)

const updateTestContract = oc
    .route({ method: 'PUT', path: '/tests/{id}' })
    .input(
        testInsertSchema
            .pick({ id: true })
            .and(testInsertSchema.omit({ id: true, createdAt: true, updatedAt: true }).partial())
    )
    .output(testInsertSchema)

const deleteTestContract = oc
    .route({ method: 'DELETE', path: '/tests/{id}' })
    .input(testInsertSchema.pick({ id: true }))
    .output(z.object({ success: z.boolean() }))

export const testsContract = {
    testCategories: {
        list: listTestCategoriesContract,
        create: createTestCategoryContract,
        update: updateTestCategoryContract,
        delete: deleteTestCategoryContract
    },
    testSpecs: {
        list: listTestSpecsContract,
        create: createTestSpecContract,
        update: updateTestSpecContract,
        delete: deleteTestSpecContract
    },
    testRequirements: {
        list: listTestRequirementsContract,
        create: createTestRequirementContract,
        update: updateTestRequirementContract,
        delete: deleteTestRequirementContract
    },
    tests: {
        list: listTestsContract,
        create: createTestContract,
        update: updateTestContract,
        delete: deleteTestContract
    }
}
