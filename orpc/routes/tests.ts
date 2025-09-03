import { implement } from '@orpc/server'
import { testsContract } from '@/orpc/contracts/tests'
import { db } from '@/db'
import { testCategory, testSpec, testRequirement, test } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { TestStatus, TestFramework, SpecStatus } from '@/lib/types'
import { authMiddleware } from '@/orpc/middleware'
import { ORPCError } from '@orpc/server'

const os = implement(testsContract).use(authMiddleware)

const listTestCategories = os.testCategories.list.handler(async ({ context }) => {
    const organizationId = context.session.session.activeOrganizationId
    if (!organizationId) {
        console.log('No active organization')
        throw new ORPCError('No active organization')
    }
    console.log('Active organization', organizationId)

    return await db.select().from(testCategory).where(eq(testCategory.organizationId, organizationId))
})

const upsertTestCategory = os.testCategories.upsert.handler(async ({ input, context }) => {
    const organizationId = context.session.session.activeOrganizationId
    if (!organizationId) {
        throw new ORPCError('No active organization')
    }

    const { id = crypto.randomUUID(), ...updates } = input

    const result = await db
        .insert(testCategory)
        .values({ id, ...updates, organizationId })
        .onConflictDoUpdate({
            target: testCategory.id,
            set: { ...updates }
        })
        .returning()

    return result[0]
})

const deleteTestCategory = os.testCategories.delete.handler(async ({ input, context }) => {
    const organizationId = context.session.session.activeOrganizationId
    if (!organizationId) {
        throw new ORPCError('No active organization')
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
        throw new ORPCError('No active organization')
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

const upsertTestSpec = os.testSpecs.upsert.handler(async ({ input, context }) => {
    const organizationId = context.session.session.activeOrganizationId
    if (!organizationId) {
        throw new ORPCError('No active organization')
    }

    const { id = crypto.randomUUID(), ...updates } = input

    const result = await db
        .insert(testSpec)
        .values({
            id,
            ...updates,
            status: updates.status as SpecStatus
        })
        .onConflictDoUpdate({
            target: testSpec.id,
            set: {
                ...updates,
                status: updates.status as SpecStatus
            }
        })
        .returning()

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
        throw new ORPCError('Spec not found or access denied')
    }

    await db.delete(testSpec).where(eq(testSpec.id, input.id))
    return { success: true }
})

const listTests = os.tests.list.handler(async ({ context }) => {
    const organizationId = context.session.session.activeOrganizationId
    if (!organizationId) {
        throw new ORPCError('No active organization')
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

const upsertTest = os.tests.upsert.handler(async ({ input }) => {
    const { id = crypto.randomUUID(), ...updates } = input
    const result = await db
        .insert(test)
        .values({
            id,
            ...updates,
            status: updates.status as TestStatus,
            framework: updates.framework as TestFramework
        })
        .onConflictDoUpdate({
            target: test.id,
            set: {
                ...updates,
                status: updates.status as TestStatus,
                framework: updates.framework as TestFramework
            }
        })
        .returning()

    return result[0]
})

const deleteTest = os.tests.delete.handler(async ({ input }) => {
    await db.delete(test).where(eq(test.id, input.id))
    return { success: true }
})

const listTestRequirements = os.testRequirements.list.handler(async ({ context }) => {
    const organizationId = context.session.session.activeOrganizationId
    if (!organizationId) {
        throw new ORPCError('No active organization')
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

const upsertTestRequirement = os.testRequirements.upsert.handler(async ({ input }) => {
    const { id = crypto.randomUUID(), ...updates } = input

    const result = await db
        .insert(testRequirement)
        .values({
            id,
            ...updates
        })
        .onConflictDoUpdate({
            target: testRequirement.id,
            set: { ...updates }
        })
        .returning()

    return result[0]
})

const deleteTestRequirement = os.testRequirements.delete.handler(async ({ input }) => {
    await db.delete(testRequirement).where(eq(testRequirement.id, input.id))
    return { success: true }
})

export const testsRouter = {
    testCategories: {
        list: listTestCategories,
        upsert: upsertTestCategory,
        delete: deleteTestCategory
    },
    testSpecs: {
        list: listTestSpecs,
        upsert: upsertTestSpec,
        delete: deleteTestSpec
    },
    testRequirements: {
        list: listTestRequirements,
        upsert: upsertTestRequirement,
        delete: deleteTestRequirement
    },
    tests: {
        list: listTests,
        upsert: upsertTest,
        delete: deleteTest
    }
}
