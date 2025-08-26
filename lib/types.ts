import type { JsonAssertionResult } from 'vitest/reporters'

export type TestStatus = JsonAssertionResult['status']

export type TestFramework = 'vitest'

// Inferred types from database schema
export type TestCategory = {
    id: string
    name: string
    title?: string | null
    description?: string | null
    parentCategoryId?: string | null
    order: number
    createdAt: Date
    updatedAt: Date
}

export type TestSpec = {
    id: string
    name: string
    title?: string | null
    description?: string | null
    testCategoryId: string
    createdAt: Date
    updatedAt: Date
}

export type TestRequirement = {
    id: string
    text: string
    description?: string | null
    order: number
    testSpecId: string
    createdAt: Date
    updatedAt: Date
}

export type Test = {
    id: string
    status?: TestStatus
    framework?: TestFramework
    code?: string | null
    testRequirementId: string
    createdAt: Date
    updatedAt: Date
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
    status?: TestStatus
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

// Update input types
export type UpdateTestCategoryInput = { id: string } & Partial<CreateTestCategoryInput>
export type UpdateTestSpecInput = { id: string } & Partial<CreateTestSpecInput>
export type UpdateTestInput = { id: string } & Partial<CreateTestInput>
