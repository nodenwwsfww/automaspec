import { oc } from '@orpc/contract'
import { implement } from '@orpc/server'
import { z } from 'zod/v4'
import {
    testCategories,
    testGroup,
    test,
    testRequirement,
    testCategoryInsertSchema,
    testGroupInsertSchema,
    testInsertSchema
} from '@/db/schema/tests'
import { eq } from 'drizzle-orm'
import { db } from '@/db'

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

// Test Groups contracts
const listTestGroupsContract = oc
    .route({ method: 'GET', path: '/test-groups' })
    .input(z.object({ testCategoriesId: z.string().optional() }))
    .output(z.array(testGroupInsertSchema))

const createTestGroupContract = oc
    .route({ method: 'POST', path: '/test-groups' })
    .input(testGroupInsertSchema.omit({ id: true, createdAt: true, updatedAt: true }))
    .output(testGroupInsertSchema)

const updateTestGroupContract = oc
    .route({ method: 'PUT', path: '/test-groups/{id}' })
    .input(
        testGroupInsertSchema
            .pick({ id: true })
            .merge(testGroupInsertSchema.omit({ id: true, createdAt: true, updatedAt: true }).partial())
    )
    .output(testGroupInsertSchema)

const deleteTestGroupContract = oc
    .route({ method: 'DELETE', path: '/test-groups/{id}' })
    .input(testGroupInsertSchema.pick({ id: true }))
    .output(z.object({ success: z.boolean() }))

// Tests contracts
const listTestsContract = oc
    .route({ method: 'GET', path: '/tests' })
    .input(z.object({ testGroupId: z.string().optional() }))
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
    testGroups: {
        list: listTestGroupsContract,
        create: createTestGroupContract,
        update: updateTestGroupContract,
        delete: deleteTestGroupContract
    },
    tests: {
        list: listTestsContract,
        create: createTestContract,
        update: updateTestContract,
        delete: deleteTestContract
    }
}

const os = implement(testsContract)

// Database implementations
const listTestCategories = os.testCategories.list.handler(async ({ input }) => {
    const categories = await db().select().from(testCategories)
    return categories.map((cat) => ({
        ...cat,
        createdAt: new Date(cat.createdAt),
        updatedAt: new Date(cat.updatedAt)
    }))
})

const createTestCategory = os.testCategories.create.handler(async ({ input }) => {
    const newCategory = {
        id: crypto.randomUUID(),
        ...input,
        createdAt: new Date(),
        updatedAt: new Date()
    }

    const result = await db().insert(testCategories).values(newCategory).returning()
    return {
        ...result[0],
        createdAt: new Date(result[0].createdAt),
        updatedAt: new Date(result[0].updatedAt)
    }
})

const updateTestCategory = os.testCategories.update.handler(async ({ input }) => {
    const { id, ...updates } = input
    const result = await db()
        .update(testCategories)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(testCategories.id, id))
        .returning()

    return {
        ...result[0],
        createdAt: new Date(result[0].createdAt),
        updatedAt: new Date(result[0].updatedAt)
    }
})

const deleteTestCategory = os.testCategories.delete.handler(async ({ input }) => {
    // First get all groups in this category
    const groupsInCategory = await db()
        .select({ id: testGroup.id })
        .from(testGroup)
        .where(eq(testGroup.testCategoriesId, input.id))

    // For each group, delete all related data
    for (const group of groupsInCategory) {
        // Get all tests in this group
        const testsInGroup = await db().select({ id: test.id }).from(test).where(eq(test.testGroupId, group.id))

        // Delete all requirements for all tests in this group
        for (const testItem of testsInGroup) {
            await db().delete(testRequirement).where(eq(testRequirement.testId, testItem.id))
        }

        // Delete all tests in this group
        await db().delete(test).where(eq(test.testGroupId, group.id))
    }

    // Delete all groups in this category
    await db().delete(testGroup).where(eq(testGroup.testCategoriesId, input.id))

    // Finally delete the category
    await db().delete(testCategories).where(eq(testCategories.id, input.id))
    return { success: true }
})

const listTestGroups = os.testGroups.list.handler(async ({ input }) => {
    const groups = await db().select().from(testGroup)
    return groups.map((group) => ({
        ...group,
        createdAt: new Date(group.createdAt),
        updatedAt: new Date(group.updatedAt)
    }))
})

const createTestGroup = os.testGroups.create.handler(async ({ input }) => {
    const newGroup = {
        id: crypto.randomUUID(),
        ...input,
        createdAt: new Date(),
        updatedAt: new Date()
    }

    const result = await db().insert(testGroup).values(newGroup).returning()
    return {
        ...result[0],
        createdAt: new Date(result[0].createdAt),
        updatedAt: new Date(result[0].updatedAt)
    }
})

const updateTestGroup = os.testGroups.update.handler(async ({ input }) => {
    const { id, ...updates } = input
    const result = await db()
        .update(testGroup)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(testGroup.id, id))
        .returning()

    return {
        ...result[0],
        createdAt: new Date(result[0].createdAt),
        updatedAt: new Date(result[0].updatedAt)
    }
})

const deleteTestGroup = os.testGroups.delete.handler(async ({ input }) => {
    // First get all tests in this group
    const testsInGroup = await db().select({ id: test.id }).from(test).where(eq(test.testGroupId, input.id))

    // Delete all requirements for all tests in this group
    for (const testItem of testsInGroup) {
        await db().delete(testRequirement).where(eq(testRequirement.testId, testItem.id))
    }

    // Then delete all tests in this group
    await db().delete(test).where(eq(test.testGroupId, input.id))

    // Finally delete the group
    await db().delete(testGroup).where(eq(testGroup.id, input.id))
    return { success: true }
})

const listTests = os.tests.list.handler(async ({ input }) => {
    const tests = await db().select().from(test)
    return tests.map((t) => ({
        ...t,
        status: t.status as 'pending' | 'running' | 'passed' | 'failed',
        createdAt: new Date(t.createdAt),
        updatedAt: new Date(t.updatedAt)
    }))
})

const createTest = os.tests.create.handler(async ({ input }) => {
    const newTest = {
        id: crypto.randomUUID(),
        ...input,
        createdAt: new Date(),
        updatedAt: new Date()
    }

    const result = await db().insert(test).values(newTest).returning()
    return {
        ...result[0],
        status: result[0].status as 'pending' | 'running' | 'passed' | 'failed',
        createdAt: new Date(result[0].createdAt),
        updatedAt: new Date(result[0].updatedAt)
    }
})

const updateTest = os.tests.update.handler(async ({ input }) => {
    const { id, ...updates } = input
    const result = await db()
        .update(test)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(test.id, id))
        .returning()

    return {
        ...result[0],
        status: result[0].status as 'pending' | 'running' | 'passed' | 'failed',
        createdAt: new Date(result[0].createdAt),
        updatedAt: new Date(result[0].updatedAt)
    }
})

const deleteTest = os.tests.delete.handler(async ({ input }) => {
    // First delete all requirements for this test
    await db().delete(testRequirement).where(eq(testRequirement.testId, input.id))

    // Then delete the test
    await db().delete(test).where(eq(test.id, input.id))
    return { success: true }
})

export const testsRouter = os.router({
    testCategories: {
        list: listTestCategories,
        create: createTestCategory,
        update: updateTestCategory,
        delete: deleteTestCategory
    },
    testGroups: {
        list: listTestGroups,
        create: createTestGroup,
        update: updateTestGroup,
        delete: deleteTestGroup
    },
    tests: {
        list: listTests,
        create: createTest,
        update: updateTest,
        delete: deleteTest
    }
})
