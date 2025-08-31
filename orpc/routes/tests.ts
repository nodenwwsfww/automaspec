import { implement } from '@orpc/server'
import { testsContract } from '@/orpc/contracts/tests'
import { db } from '@/db'
import { testCategory, testSpec, testRequirement, test } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { TestStatus, TestFramework, SpecStatus } from '@/lib/types'
import { authMiddleware } from '@/orpc/middleware'

const os = implement(testsContract).use(authMiddleware)

const listTestCategories = os.testCategories.list.handler(async ({ context }) => {
    const organizationId = context.session.session.activeOrganizationId
    if (!organizationId) {
        throw new Error('No active organization')
    }

    return await db.select().from(testCategory).where(eq(testCategory.organizationId, organizationId))
})

const createTestCategory = os.testCategories.create.handler(async ({ input, context }) => {
    const organizationId = context.session.session.activeOrganizationId
    if (!organizationId) {
        throw new Error('No active organization')
    }

    const newCategory = {
        id: crypto.randomUUID(),
        ...input,
        organizationId
    }

    const result = await db.insert(testCategory).values(newCategory).returning()
    return result[0]
})

const updateTestCategory = os.testCategories.update.handler(async ({ input, context }) => {
    const organizationId = context.session.session.activeOrganizationId
    if (!organizationId) {
        throw new Error('No active organization')
    }

    const { id, ...updates } = input
    const result = await db
        .update(testCategory)
        .set({ ...updates })
        .where(and(eq(testCategory.id, id), eq(testCategory.organizationId, organizationId)))
        .returning()

    return result[0]
})

const deleteTestCategory = os.testCategories.delete.handler(async ({ input, context }) => {
    const organizationId = context.session.session.activeOrganizationId
    if (!organizationId) {
        throw new Error('No active organization')
    }

    const deletedCategory = await db
        .delete(testCategory)
        .where(and(eq(testCategory.id, input.id), eq(testCategory.organizationId, organizationId)))
        .returning({
            id: testCategory.id
        })

    if (!deletedCategory || deletedCategory.length === 0) {
        return { success: false }
    }

    return { success: true }
})

const listTestSpecs = os.testSpecs.list.handler(async ({ context }) => {
    const organizationId = context.session.session.activeOrganizationId
    if (!organizationId) {
        throw new Error('No active organization')
    }

    return await db
        .select({
            id: testSpec.id,
            name: testSpec.name,
            title: testSpec.title,
            description: testSpec.description,
            status: testSpec.status,
            testCategoryId: testSpec.testCategoryId,
            createdAt: testSpec.createdAt,
            updatedAt: testSpec.updatedAt
        })
        .from(testSpec)
        .innerJoin(testCategory, eq(testSpec.testCategoryId, testCategory.id))
        .where(eq(testCategory.organizationId, organizationId))
})

const createTestSpec = os.testSpecs.create.handler(async ({ input, context }) => {
    const organizationId = context.session.session.activeOrganizationId
    if (!organizationId) {
        throw new Error('No active organization')
    }

    // Verify the category belongs to the current organization
    const category = await db
        .select({ id: testCategory.id })
        .from(testCategory)
        .where(and(eq(testCategory.id, input.testCategoryId), eq(testCategory.organizationId, organizationId)))
        .limit(1)

    if (!category || category.length === 0) {
        throw new Error('Category not found or access denied')
    }

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

const updateTestSpec = os.testSpecs.update.handler(async ({ input, context }) => {
    const organizationId = context.session.session.activeOrganizationId
    if (!organizationId) {
        throw new Error('No active organization')
    }

    const { id, ...updates } = input
    const result = await db
        .update(testSpec)
        .set({ ...updates, status: updates.status as SpecStatus })
        .where(eq(testSpec.id, id))
        .returning()

    // Verify the spec belongs to the organization (after update, check via JOIN)
    if (result.length > 0) {
        const verification = await db
            .select({ id: testSpec.id })
            .from(testSpec)
            .innerJoin(testCategory, eq(testSpec.testCategoryId, testCategory.id))
            .where(and(eq(testSpec.id, id), eq(testCategory.organizationId, organizationId)))
            .limit(1)

        if (!verification || verification.length === 0) {
            throw new Error('Access denied')
        }
    }

    return result[0]
})

const deleteTestSpec = os.testSpecs.delete.handler(async ({ input, context }) => {
    const organizationId = context.session.session.activeOrganizationId
    if (!organizationId) {
        throw new Error('No active organization')
    }

    // Verify the spec belongs to the organization before deletion
    const verification = await db
        .select({ id: testSpec.id })
        .from(testSpec)
        .innerJoin(testCategory, eq(testSpec.testCategoryId, testCategory.id))
        .where(and(eq(testSpec.id, input.id), eq(testCategory.organizationId, organizationId)))
        .limit(1)

    if (!verification || verification.length === 0) {
        throw new Error('Spec not found or access denied')
    }

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
const listTests = os.tests.list.handler(async ({ context }) => {
    const organizationId = context.session.session.activeOrganizationId
    if (!organizationId) {
        throw new Error('No active organization')
    }

    return await db
        .select({
            id: test.id,
            status: test.status,
            framework: test.framework,
            code: test.code,
            testRequirementId: test.testRequirementId,
            createdAt: test.createdAt,
            updatedAt: test.updatedAt
        })
        .from(test)
        .innerJoin(testRequirement, eq(test.testRequirementId, testRequirement.id))
        .innerJoin(testSpec, eq(testRequirement.testSpecId, testSpec.id))
        .innerJoin(testCategory, eq(testSpec.testCategoryId, testCategory.id))
        .where(eq(testCategory.organizationId, organizationId))
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
const listTestRequirements = os.testRequirements.list.handler(async ({ context }) => {
    const organizationId = context.session.session.activeOrganizationId
    if (!organizationId) {
        throw new Error('No active organization')
    }

    return await db
        .select({
            id: testRequirement.id,
            text: testRequirement.text,
            description: testRequirement.description,
            order: testRequirement.order,
            testSpecId: testRequirement.testSpecId,
            createdAt: testRequirement.createdAt,
            updatedAt: testRequirement.updatedAt
        })
        .from(testRequirement)
        .innerJoin(testSpec, eq(testRequirement.testSpecId, testSpec.id))
        .innerJoin(testCategory, eq(testSpec.testCategoryId, testCategory.id))
        .where(eq(testCategory.organizationId, organizationId))
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
