import { implement } from '@orpc/server'
import { testsContract } from '@/orpc/contracts/tests'
import { db } from '@/db'
import { testFolder, testSpec, testRequirement, test } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { TestStatus, TestFramework } from '@/lib/types'
import { authMiddleware, organizationMiddleware } from '@/orpc/middleware'
import { ORPCError } from '@orpc/server'

const os = implement(testsContract).use(authMiddleware).use(organizationMiddleware)

// RIGHT
const listTestFolders = os.testFolders.list.handler(async ({ context }) => {
    return await db.select().from(testFolder).where(eq(testFolder.organizationId, context.organizationId))
})

// WRONG
const upsertTestFolder = os.testFolders.upsert.handler(async ({ input, context }) => {
    const { id = crypto.randomUUID(), ...updates } = input

    const result = await db
        .insert(testFolder)
        .values({ id, ...updates, organizationId: context.organizationId })
        .onConflictDoUpdate({
            target: testFolder.id,
            set: { ...updates }
        })
        .returning()

    return result[0]
})

const deleteTestFolder = os.testFolders.delete.handler(async ({ input, context }) => {
    const organizationId = context.organizationId

    const deletedFolder = await db
        .delete(testFolder)
        .where(and(eq(testFolder.id, input.id), eq(testFolder.organizationId, organizationId)))
        .returning({
            id: testFolder.id
        })

    if (!deletedFolder || deletedFolder.length === 0) {
        return { success: false }
    }

    return { success: true }
})

const listTestSpecs = os.testSpecs.list.handler(async ({ context }) => {
    const organizationId = context.organizationId

    return await db.select().from(testSpec).where(eq(testSpec.organizationId, organizationId))
})

const upsertTestSpec = os.testSpecs.upsert.handler(async ({ input }) => {
    const { id = crypto.randomUUID(), ...updates } = input

    const result = await db
        .insert(testSpec)
        .values({
            id,
            ...updates
        })
        .onConflictDoUpdate({
            target: testSpec.id,
            set: {
                ...updates
            }
        })
        .returning()

    return result[0]
})

const deleteTestSpec = os.testSpecs.delete.handler(async ({ input, context }) => {
    const organizationId = context.organizationId

    // Verify the spec belongs to the organization before deletion
    const verification = await db
        .select({ id: testSpec.id })
        .from(testSpec)
        .innerJoin(testFolder, eq(testSpec.folderId, testFolder.id))
        .where(and(eq(testSpec.id, input.id), eq(testFolder.organizationId, organizationId)))
        .limit(1)

    if (!verification || verification.length === 0) {
        throw new ORPCError('Spec not found or access denied')
    }

    await db.delete(testSpec).where(eq(testSpec.id, input.id))
    return { success: true }
})

const listTests = os.tests.list.handler(async ({ context }) => {
    const organizationId = context.organizationId

    return await db
        .select({
            id: test.id,
            status: test.status,
            framework: test.framework,
            code: test.code,
            requirementId: test.requirementId,
            createdAt: test.createdAt,
            updatedAt: test.updatedAt
        })
        .from(test)
        .innerJoin(testRequirement, eq(test.requirementId, testRequirement.id))
        .innerJoin(testSpec, eq(testRequirement.specId, testSpec.id))
        .innerJoin(testFolder, eq(testSpec.folderId, testFolder.id))
        .where(eq(testFolder.organizationId, organizationId))
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

const listTestRequirements = os.testRequirements.list.handler(async ({ input }) => {
    const conditions = []

    if (input.specId) {
        conditions.push(eq(testRequirement.specId, input.specId))
    }

    return await db
        .select()
        .from(testRequirement)
        .where(and(...conditions))
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
    testFolders: {
        list: listTestFolders,
        upsert: upsertTestFolder,
        delete: deleteTestFolder
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
