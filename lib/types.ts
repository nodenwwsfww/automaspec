import { z } from 'zod/v4'

// Import schemas from contracts
const TestCategorySchema = z.object({
    id: z.string(),
    title: z.string(),
    parentId: z.string().nullable(),
    order: z.number().int().default(0),
    createdAt: z.date(),
    updatedAt: z.date()
})

const TestSpecSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().nullable(),
    testCategoriesId: z.string(),
    createdAt: z.date(),
    updatedAt: z.date()
})

const TestRequirementSchema = z.object({
    id: z.string(),
    text: z.string(),
    status: z.enum(['pending', 'running', 'passed', 'failed']).default('pending'),
    order: z.number().int().default(0),
    testId: z.string(),
    createdAt: z.date(),
    updatedAt: z.date()
})

const TestSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().nullable(),
    status: z.enum(['pending', 'running', 'passed', 'failed']).default('pending'),
    actualResult: z.string().nullable(),
    expectedResult: z.string().nullable(),
    framework: z.string().nullable().default('Playwright'),
    code: z.string().nullable(),
    testGroupId: z.string(),
    requirements: z.array(TestRequirementSchema).optional(),
    createdAt: z.date(),
    updatedAt: z.date()
})

// Export inferred types
export type TestCategory = z.infer<typeof TestCategorySchema>
export type TestSpec = z.infer<typeof TestSpecSchema>
export type TestRequirement = z.infer<typeof TestRequirementSchema>
export type Test = z.infer<typeof TestSchema>

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

// Tree node types for the dashboard
export interface TreeNode {
    id: string
    name: string
    type: 'category' | 'spec' | 'requirement' | 'test'
    children?: TreeNode[]
    icon?: any
    passed: number
    total: number
    status: 'passed' | 'failed' | 'pending' | 'running'
    // Original data
    category?: TestCategory
    spec?: TestSpec
    requirement?: TestRequirement
    test?: Test
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

// Status types
export type TestStatus = 'pending' | 'running' | 'passed' | 'failed'
export type DisplayStatus = TestStatus | 'healthy' | 'warning' | 'skipped'
