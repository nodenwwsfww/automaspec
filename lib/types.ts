import { z } from 'zod/v4'

// Import schemas from contracts
const TestCategorySchema = z.object({
  id: z.string(),
  title: z.string(),
  parentId: z.string().nullable(),
  order: z.number().int().default(0),
  createdAt: z.date(),
  updatedAt: z.date(),
})

const TestGroupSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  testCategoriesId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

const TestRequirementSchema = z.object({
  id: z.string(),
  text: z.string(),
  status: z.enum(['pending', 'running', 'passed', 'failed']).default('pending'),
  order: z.number().int().default(0),
  testId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
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
  updatedAt: z.date(),
})

// Export inferred types
export type TestCategory = z.infer<typeof TestCategorySchema>
export type TestGroup = z.infer<typeof TestGroupSchema>
export type TestRequirement = z.infer<typeof TestRequirementSchema>
export type Test = z.infer<typeof TestSchema>

// API response types
export interface TestDataResponse {
  categories: TestCategory[]
  groups: TestGroup[]
  tests: Test[]
  requirements: TestRequirement[]
}

// Extended types for UI components
export interface TestGroupWithType extends TestGroup {
  type: 'group'
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
  type: 'category' | 'group' | 'test'
  children?: TreeNode[]
  icon?: any
  passed: number
  total: number
  status: 'passed' | 'failed' | 'pending' | 'running'
  // Original data
  category?: TestCategory
  group?: TestGroup
  test?: Test
}

// Union type for editing different node types
export type EditableNode = TestGroupWithType | TestCategoryWithType | TestWithType

// Form input types
export type CreateTestCategoryInput = Omit<TestCategory, 'id' | 'createdAt' | 'updatedAt'>
export type CreateTestGroupInput = Omit<TestGroup, 'id' | 'createdAt' | 'updatedAt'>
export type CreateTestInput = Omit<Test, 'id' | 'createdAt' | 'updatedAt'>
export type CreateTestRequirementInput = Omit<TestRequirement, 'id' | 'createdAt' | 'updatedAt'>

// Update input types  
export type UpdateTestCategoryInput = { id: string } & Partial<CreateTestCategoryInput>
export type UpdateTestGroupInput = { id: string } & Partial<CreateTestGroupInput>
export type UpdateTestInput = { id: string } & Partial<CreateTestInput>

// Status types
export type TestStatus = 'pending' | 'running' | 'passed' | 'failed'
export type DisplayStatus = TestStatus | 'healthy' | 'warning' | 'skipped' 