import * as schema from '@/db/schema'
import { createSelectSchema, createInsertSchema } from 'drizzle-zod'
import type { authClient } from './shared/better-auth'
import * as z from 'zod'
import { TEST_STATUSES, SPEC_STATUSES } from './constants'

// FIXME: will work after https://github.com/drizzle-team/drizzle-orm/pull/4820, removing all manual zod coercions
// const { createInsertSchema, createSelectSchema } = createSchemaFactory({
//     coerce: {
//       date: true
//     }
// });

const testSpecSelectSchema2 = createSelectSchema(schema.testSpec, {
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date()
})
export type TestSpec2 = z.infer<typeof testSpecSelectSchema2>

export const testCategorySelectSchema = createSelectSchema(schema.testCategory, {
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date()
})
export const testCategoryInsertSchema = createInsertSchema(schema.testCategory, {
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date()
})
export const testSpecSelectSchema = createSelectSchema(schema.testSpec, {
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date()
})
export const testSpecInsertSchema = createInsertSchema(schema.testSpec, {
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date()
})
export const testRequirementSelectSchema = createSelectSchema(schema.testRequirement, {
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date()
})
export const testRequirementInsertSchema = createInsertSchema(schema.testRequirement, {
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date()
})
export const testSelectSchema = createSelectSchema(schema.test, {
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date()
})
export const testInsertSchema = createInsertSchema(schema.test, {
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date()
})

export type TestFramework = 'vitest'
export type OrganizationPlan = 'free' | 'pro' | 'enterprise'
export type TestStatus = keyof typeof TEST_STATUSES
export type SpecStatus = keyof typeof SPEC_STATUSES
export type TestCategory = z.infer<typeof testCategorySelectSchema>
export type TestSpec = z.infer<typeof testSpecSelectSchema>
export type TestRequirement = z.infer<typeof testRequirementSelectSchema>

// I check correct types up to here

export type Test = z.infer<typeof testSelectSchema> & {
    // title?: string
    // description?: string
    // requirements?: TestRequirement[]
}

// Tree node types for the dashboard
export type TreeNode = {
    id: string
    name: string
    type: 'category' | 'spec'
    children?: TreeNode[]
    passed?: number
    failed?: number
    pending?: number
    skipped?: number
    todo?: number
    total?: number
    icon?: React.ElementType
    spec?: TestSpec
    category?: TestCategory
} & ({ type: 'category'; status: TestStatus } | { type: 'spec'; status: SpecStatus })

// API response types
export interface TestDataResponse {
    categories: TestCategory[]
    specs: TestSpec[]
    tests: Test[]
    requirements: TestRequirement[]
}

// Extended types for UI components
export interface TestSpecWithType extends TestSpec {
    type: 'spec'
}

export interface TestCategoryWithType extends TestCategory {
    type: 'category'
}

export interface TestWithType extends Test {
    type: 'test'
}

// Type for selected spec with its requirements and associated tests
export interface SelectedSpec extends TestSpec {
    requirements: (TestRequirement & {
        test?: Test
        status?: TestStatus
    })[]
}

// Union type for editing different node types
export type EditableNode = TestSpecWithType | TestCategoryWithType | TestWithType

// Form input types
export type CreateTestCategoryInput = Omit<TestCategory, 'id' | 'createdAt' | 'updatedAt'>
export type CreateTestSpecInput = Omit<TestSpec, 'id' | 'createdAt' | 'updatedAt'>
export type CreateTestInput = Omit<Test, 'id' | 'createdAt' | 'updatedAt'>
export type CreateTestRequirementInput = Omit<TestRequirement, 'id' | 'createdAt' | 'updatedAt'>

// Use organization types directly from database schema
export const organizationSelectSchema = createSelectSchema(schema.organization)
export const memberSelectSchema = createSelectSchema(schema.member)
export const invitationSelectSchema = createSelectSchema(schema.invitation)
export type Organization = z.infer<typeof organizationSelectSchema>
export type Member = z.infer<typeof memberSelectSchema>
export type Invitation = z.infer<typeof invitationSelectSchema>
// Session has user and session
export type Session = typeof authClient.$Infer.Session
export type User = Session['user']

// Update input types
export type UpdateTestCategoryInput = { id: string } & Partial<CreateTestCategoryInput>
export type UpdateTestSpecInput = { id: string } & Partial<CreateTestSpecInput>
export type UpdateTestInput = { id: string } & Partial<CreateTestInput>

// Organization input types (using Drizzle's InferInsertModel)
export const organizationInsertSchema = createInsertSchema(schema.organization)
export const memberInsertSchema = createInsertSchema(schema.member)
export const invitationInsertSchema = createInsertSchema(schema.invitation)
export type CreateOrganizationInput = z.infer<typeof organizationInsertSchema>
export type CreateMemberInput = z.infer<typeof memberInsertSchema>
export type CreateInvitationInput = z.infer<typeof invitationInsertSchema>
