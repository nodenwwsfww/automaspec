import { implement } from '@orpc/server'
import { testsContract } from '@/orpc/contracts/tests'
import { db } from '@/db'
import { testCategory, testSpec, testRequirement, test } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { TestStatus, TestFramework, SpecStatus } from '@/lib/types'
import { authMiddleware } from '@/orpc/middleware'

const os = implement(testsContract).use(authMiddleware)

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

// oxlint-disable-next-line no-unused-vars
const listTestSpecs = os.testSpecs.list.handler(async ({ input }) => {
    return await db.select().from(testSpec)
})

const createTestSpec = os.testSpecs.create.handler(async ({ input }) => {
    const newSpec = {
        id: crypto.randomUUID(),
        ...input
    }
    const result = await db
        .insert(testSpec)
        .values({
            ...newSpec,
            status: newSpec.status as SpecStatus
        })
        .returning()
    return result[0]
})

const updateTestSpec = os.testSpecs.update.handler(async ({ input }) => {
    const { id, ...updates } = input
    const result = await db
        .update(testSpec)
        .set({ ...updates, status: updates.status as SpecStatus })
        .where(eq(testSpec.id, id))
        .returning()

    return result[0]
})

const deleteTestSpec = os.testSpecs.delete.handler(async ({ input }) => {
    // TODO: This is unnecessary, because specs are cascade deleted on category deletion
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

// oxlint-disable-next-line no-unused-vars
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

// oxlint-disable-next-line no-unused-vars
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

export const testsRouter = {
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
}
