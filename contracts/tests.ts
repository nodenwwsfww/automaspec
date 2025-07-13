import { oc } from '@orpc/contract'
import { implement } from '@orpc/server'
import { z } from 'zod/v4'
import {
    testCategory,
    testSpec,
    test,
    testRequirement,
    testCategoryInsertSchema,
    testSpecInsertSchema,
    testInsertSchema,
    testRequirementInsertSchema
} from '@/db/schema/tests'
import { eq } from 'drizzle-orm'
import { db } from '@/db'
import type { TestFramework, TestStatus } from '@/lib/types'

// Test Categories contracts
const listTestCategoriesContract = oc
    .route({ method: 'GET', path: '/test-categories' })
    .input(z.object({ parentId: z.string().optional() }))
    .output(z.array(testCategoryInsertSchema))

const createTestCategoryContract = oc
    .route({ method: 'POST', path: '/test-categories' })
    .input(testCategoryInsertSchema.omit({ id: true, createdAt: true, updatedAt: true }))
    .output(testCategoryInsertSchema)

const updateTestCategoryContract = oc
    .route({ method: 'PUT', path: '/test-categories/{id}' })
    .input(
        testCategoryInsertSchema
            .pick({ id: true })
            .merge(testCategoryInsertSchema.omit({ id: true, createdAt: true, updatedAt: true }).partial())
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
            .merge(testSpecInsertSchema.omit({ id: true, createdAt: true, updatedAt: true }).partial())
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
            .merge(testRequirementInsertSchema.omit({ id: true, createdAt: true, updatedAt: true }).partial())
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
            .merge(testInsertSchema.omit({ id: true, createdAt: true, updatedAt: true }).partial())
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

const os = implement(testsContract)

const listTestCategories = os.testCategories.list.handler(async () => {
    return await db.select().from(testCategory)
})

const createTestCategory = os.testCategories.create.handler(async ({ input }) => {
    const newCategory = {
        id: crypto.randomUUID(),
        ...input
    }

    const result = await db.insert(testCategory).values(newCategory).returning()
    return result[0]
})

const updateTestCategory = os.testCategories.update.handler(async ({ input }) => {
    const { id, ...updates } = input
    const result = await db
        .update(testCategory)
        .set({ ...updates })
        .where(eq(testCategory.id, id))
        .returning()

    return result[0]
})

const deleteTestCategory = os.testCategories.delete.handler(async ({ input }) => {
    // TODO: I guess this is unnecessary, because specs are cascade deleted on category deletion
    // First get all specs in this category
    const specsInCategory = await db
        .select({ id: testSpec.id })
        .from(testSpec)
        .where(eq(testSpec.testCategoryId, input.id))

    // For each spec, delete all related data
    for (const spec of specsInCategory) {
        // Get all requirements in this spec
        const requirementsInSpec = await db
            .select({ id: testRequirement.id })
            .from(testRequirement)
            .where(eq(testRequirement.testSpecId, spec.id))

        // Delete all tests for each requirement
        for (const requirement of requirementsInSpec) {
            await db.delete(test).where(eq(test.testRequirementId, requirement.id))
        }

        // Delete all requirements in this spec
        await db.delete(testRequirement).where(eq(testRequirement.testSpecId, spec.id))
    }

    // Delete all specs in this category
    await db.delete(testSpec).where(eq(testSpec.testCategoryId, input.id))

    // Finally delete the category
    await db.delete(testCategory).where(eq(testCategory.id, input.id))
    return { success: true }
})

const listTestSpecs = os.testSpecs.list.handler(async ({ input }) => {
    return await db.select().from(testSpec)
})

const createTestSpec = os.testSpecs.create.handler(async ({ input }) => {
    const newSpec = {
        id: crypto.randomUUID(),
        ...input
    }

    const result = await db.insert(testSpec).values(newSpec).returning()
    return result[0]
})

const updateTestSpec = os.testSpecs.update.handler(async ({ input }) => {
    const { id, ...updates } = input
    const result = await db
        .update(testSpec)
        .set({ ...updates })
        .where(eq(testSpec.id, id))
        .returning()

    return result[0]
})

const deleteTestSpec = os.testSpecs.delete.handler(async ({ input }) => {
    // TODO: I guess this is unnecessary, because specs are cascade deleted on category deletion
    // Get all requirements in this spec
    const requirementsInSpec = await db
        .select({ id: testRequirement.id })
        .from(testRequirement)
        .where(eq(testRequirement.testSpecId, input.id))

    // Delete all tests for each requirement
    for (const requirement of requirementsInSpec) {
        await db.delete(test).where(eq(test.testRequirementId, requirement.id))
    }

    // Delete all requirements in this spec
    await db.delete(testRequirement).where(eq(testRequirement.testSpecId, input.id))

    // Finally delete the spec
    await db.delete(testSpec).where(eq(testSpec.id, input.id))
    return { success: true }
})

const listTests = os.tests.list.handler(async ({ input }) => {
    return await db.select().from(test)
})

const createTest = os.tests.create.handler(async ({ input }) => {
    const newTest = {
        id: crypto.randomUUID(),
        ...input,
        status: input.status as TestStatus,
        framework: input.framework as TestFramework
    }

    const result = await db.insert(test).values(newTest).returning()
    return result[0]
})

const updateTest = os.tests.update.handler(async ({ input }) => {
    const { id, ...updates } = input
    const result = await db
        .update(test)
        .set({
            ...updates,
            status: updates.status as TestStatus,
            framework: updates.framework as TestFramework
        })
        .where(eq(test.id, id))
        .returning()

    return result[0]
})

const deleteTest = os.tests.delete.handler(async ({ input }) => {
    await db.delete(test).where(eq(test.id, input.id))
    return { success: true }
})

const listTestRequirements = os.testRequirements.list.handler(async ({ input }) => {
    return await db.select().from(testRequirement)
})

const createTestRequirement = os.testRequirements.create.handler(async ({ input }) => {
    const newRequirement = {
        id: crypto.randomUUID(),
        ...input
    }

    const result = await db.insert(testRequirement).values(newRequirement).returning()
    return result[0]
})

const updateTestRequirement = os.testRequirements.update.handler(async ({ input }) => {
    const { id, ...updates } = input
    const result = await db
        .update(testRequirement)
        .set({ ...updates })
        .where(eq(testRequirement.id, id))
        .returning()

    return result[0]
})

const deleteTestRequirement = os.testRequirements.delete.handler(async ({ input }) => {
    // Tests are cascade deleted on requirement deletion
    await db.delete(testRequirement).where(eq(testRequirement.id, input.id))
    return { success: true }
})

export const testsRouter = os.router({
    testCategories: {
        list: listTestCategories,
        create: createTestCategory,
        update: updateTestCategory,
        delete: deleteTestCategory
    },
    testSpecs: {
        list: listTestSpecs,
        create: createTestSpec,
        update: updateTestSpec,
        delete: deleteTestSpec
    },
    testRequirements: {
        list: listTestRequirements,
        create: createTestRequirement,
        update: updateTestRequirement,
        delete: deleteTestRequirement
    },
    tests: {
        list: listTests,
        create: createTest,
        update: updateTest,
        delete: deleteTest
    }
})
