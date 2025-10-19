import { implement } from '@orpc/server'
import { testsContract } from '@/orpc/contracts/tests'
import { db } from '@/db'
import { testFolder, testSpec, testRequirement, test } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { TestStatus, TestFramework, SpecStatus, VitestTestResult, VitestReport } from '@/lib/types'
import { authMiddleware, organizationMiddleware } from '@/orpc/middleware'
import { ORPCError } from '@orpc/server'
import { TEST_STATUSES } from '@/lib/constants'

const os = implement(testsContract).use(authMiddleware).use(organizationMiddleware)

const getTestFolder = os.testFolders.get.handler(async ({ input, context }) => {
    const folder = await db
        .select()
        .from(testFolder)
        .where(and(eq(testFolder.id, input.id), eq(testFolder.organizationId, context.organizationId)))
        .limit(1)

    if (folder.length === 0) {
        throw new ORPCError('Folder not found')
    }

    return folder[0]
})

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

const syncReport = os.tests.syncReport.handler(async ({ input, context }) => {
    console.log('=== SYNC REPORT STARTED ===')
    console.log('Organization ID:', context.organizationId)

    const titleToStatus: Record<string, TestStatus> = {}
    const report = input as VitestReport

    if (report.testResults) {
        report.testResults.forEach((result: VitestTestResult) => {
            if (result.assertionResults) {
                result.assertionResults.forEach((assertion) => {
                    if (assertion.title && assertion.status && assertion.status !== TEST_STATUSES.missing) {
                        titleToStatus[assertion.title.toLowerCase()] = assertion.status as TestStatus
                    }
                })
            }
        })
    }

    console.log(`Found ${Object.keys(titleToStatus).length} tests in report:`)
    Object.entries(titleToStatus).forEach(([title, status]) => {
        console.log(`  - "${title}": ${status}`)
    })

    const orgTests = await db
        .select({
            testId: test.id,
            testStatus: test.status,
            requirementName: testRequirement.name,
            specId: testSpec.id
        })
        .from(test)
        .innerJoin(testRequirement, eq(test.requirementId, testRequirement.id))
        .innerJoin(testSpec, eq(testRequirement.specId, testSpec.id))
        .where(eq(testSpec.organizationId, context.organizationId))

    console.log(`Found ${orgTests.length} tests in database for organization`)

    const matchedIds: string[] = []
    const updates: Array<{ id: string; status: TestStatus; oldStatus: TestStatus; name: string }> = []

    orgTests.forEach((orgTest) => {
        const reportedStatus = titleToStatus[orgTest.requirementName.toLowerCase()]
        if (reportedStatus) {
            matchedIds.push(orgTest.testId)
            if (orgTest.testStatus !== reportedStatus) {
                updates.push({
                    id: orgTest.testId,
                    status: reportedStatus,
                    oldStatus: orgTest.testStatus,
                    name: orgTest.requirementName
                })
                console.log(`  UPDATE: "${orgTest.requirementName}" ${orgTest.testStatus} → ${reportedStatus}`)
            } else {
                console.log(`  SKIP: "${orgTest.requirementName}" already ${reportedStatus}`)
            }
        }
    })

    const missingIds = orgTests.filter((t) => !matchedIds.includes(t.testId)).map((t) => t.testId)
    const missingTests = orgTests.filter((t) => !matchedIds.includes(t.testId))

    console.log(`\nTests to mark as MISSING (${missingIds.length}):`)
    missingTests.forEach((t) => {
        console.log(`  - "${t.requirementName}" (was: ${t.testStatus})`)
    })

    console.log(`\nApplying ${updates.length} updates and ${missingIds.length} missing markers...`)

    const updatePromises = [
        ...updates.map((u) => db.update(test).set({ status: u.status }).where(eq(test.id, u.id))),
        ...missingIds.map((id) =>
            db
                .update(test)
                .set({ status: TEST_STATUSES.missing as TestStatus })
                .where(eq(test.id, id))
        )
    ]
    await Promise.all(updatePromises)

    console.log('All test status updates applied')

    const affectedSpecIds = [...new Set(orgTests.map((t) => t.specId))]
    console.log(`\nRecalculating aggregates for ${affectedSpecIds.length} specs...`)

    const allSpecTests = await db
        .select({
            specId: testRequirement.specId,
            status: test.status
        })
        .from(test)
        .innerJoin(testRequirement, eq(test.requirementId, testRequirement.id))
        .innerJoin(testSpec, eq(testRequirement.specId, testSpec.id))
        .where(eq(testSpec.organizationId, context.organizationId))

    const specData: Record<string, { counts: Record<SpecStatus, number>; total: number }> = {}

    affectedSpecIds.forEach((specId) => {
        specData[specId] = {
            counts: Object.fromEntries(Object.values(TEST_STATUSES).map((status) => [status, 0])) as Record<
                SpecStatus,
                number
            >,
            total: 0
        }
    })

    allSpecTests.forEach((t) => {
        if (specData[t.specId] && t.status in specData[t.specId].counts) {
            specData[t.specId].counts[t.status as SpecStatus]++
            specData[t.specId].total++
        }
    })

    affectedSpecIds.forEach((specId) => {
        const data = specData[specId]
        console.log(
            `  Spec ${specId}: Total=${data.total}, Passed=${data.counts.passed}, Failed=${data.counts.failed}, Missing=${data.counts.missing}`
        )
    })

    const specUpdatePromises = affectedSpecIds.map((specId) =>
        db
            .update(testSpec)
            .set({
                statuses: specData[specId].counts,
                numberOfTests: specData[specId].total
            })
            .where(eq(testSpec.id, specId))
    )
    await Promise.all(specUpdatePromises)

    console.log('Spec aggregates updated')
    console.log('=== SYNC REPORT COMPLETED ===')
    console.log(`Summary: Updated ${updates.length}, Missing ${missingIds.length}`)

    return { updated: updates.length, missing: missingIds.length }
})

export const testsRouter = {
    testFolders: {
        get: getTestFolder,
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
        delete: deleteTest,
        syncReport: syncReport
    }
}
