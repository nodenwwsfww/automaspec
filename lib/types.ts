// https://github.com/vitest-dev/vitest/blob/main/packages/vitest/src/node/reporters/json.ts
import type { JsonAssertionResult } from 'vitest/reporters'
import type { InferSelectModel, InferInsertModel } from 'drizzle-orm'
import * as schema from '@/db/schema'

export type TestStatus = JsonAssertionResult['status']
export type SpecStatus = 'skipped' | 'todo' | 'default'
export type TestFramework = 'vitest'
export type OrganizationPlan = 'free' | 'pro' | 'enterprise'

export type TestCategory = InferSelectModel<typeof schema.testCategory>
export type TestSpec = InferSelectModel<typeof schema.testSpec>
export type TestRequirement = InferSelectModel<typeof schema.testRequirement>
export type Test = InferSelectModel<typeof schema.test> & {
    // Extended properties for UI
    title?: string
    description?: string
    requirements?: TestRequirement[]
}

// Tree node types for the dashboard
export interface TreeNode {
    id: string
    name: string
    type: 'category' | 'spec' | 'test'
    children?: TreeNode[]
    passed?: number
    total?: number
    status?: TestStatus | SpecStatus
    icon?: React.ElementType
    spec?: TestSpec
    category?: TestCategory
    test?: Test
    requirement?: TestRequirement
}

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

// Union type for editing different node types
export type EditableNode = TestSpecWithType | TestCategoryWithType | TestWithType

// Form input types
export type CreateTestCategoryInput = Omit<TestCategory, 'id' | 'createdAt' | 'updatedAt'>
export type CreateTestSpecInput = Omit<TestSpec, 'id' | 'createdAt' | 'updatedAt'>
export type CreateTestInput = Omit<Test, 'id' | 'createdAt' | 'updatedAt'>
export type CreateTestRequirementInput = Omit<TestRequirement, 'id' | 'createdAt' | 'updatedAt'>

// Use organization types directly from database schema
export type Organization = InferSelectModel<typeof schema.organization>
export type Member = InferSelectModel<typeof schema.member>
export type Invitation = InferSelectModel<typeof schema.invitation>
export type User = InferSelectModel<typeof schema.user>
export type Session = InferSelectModel<typeof schema.session>

// Update input types
export type UpdateTestCategoryInput = { id: string } & Partial<CreateTestCategoryInput>
export type UpdateTestSpecInput = { id: string } & Partial<CreateTestSpecInput>
export type UpdateTestInput = { id: string } & Partial<CreateTestInput>

// Organization input types (using Drizzle's InferInsertModel)
export type CreateOrganizationInput = InferInsertModel<typeof schema.organization>
export type CreateMemberInput = InferInsertModel<typeof schema.member>
export type CreateInvitationInput = InferInsertModel<typeof schema.invitation>
