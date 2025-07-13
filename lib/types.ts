export type TestStatus = 'pending' | 'passed' | 'failed' | 'warning' | 'skipped'
export type TestFramework = 'Playwright' | 'Vitest'

// Old types

// // Export inferred types
// export type TestCategory = z.infer<typeof TestCategorySchema>
// export type TestSpec = z.infer<typeof TestSpecSchema>
// export type TestRequirement = z.infer<typeof TestRequirementSchema>
// export type Test = z.infer<typeof TestSchema>

// // API response types
// export interface TestDataResponse {
//     categories: TestCategory[]
//     specs: TestSpec[]
//     tests: Test[]
//     requirements: TestRequirement[]
// }

// // Extended types for UI components
// export interface TestSpecWithType extends TestSpec {
//     type: 'spec'
// }

// export interface TestCategoryWithType extends TestCategory {
//     type: 'category'
// }

// export interface TestWithType extends Test {
//     type: 'test'
// }

// // Tree node types for the dashboard
// export interface TreeNode {
//     id: string
//     name: string
//     type: 'category' | 'spec' | 'requirement' | 'test'
//     children?: TreeNode[]
//     icon?: any
//     passed: number
//     total: number
//     status: 'passed' | 'failed' | 'pending' | 'running'
//     // Original data
//     category?: TestCategory
//     spec?: TestSpec
//     requirement?: TestRequirement
//     test?: Test
// }

// // Union type for editing different node types
// export type EditableNode = TestSpecWithType | TestCategoryWithType | TestWithType

// // Form input types
// export type CreateTestCategoryInput = Omit<TestCategory, 'id' | 'createdAt' | 'updatedAt'>
// export type CreateTestSpecInput = Omit<TestSpec, 'id' | 'createdAt' | 'updatedAt'>
// export type CreateTestInput = Omit<Test, 'id' | 'createdAt' | 'updatedAt'>
// export type CreateTestRequirementInput = Omit<TestRequirement, 'id' | 'createdAt' | 'updatedAt'>

// // Update input types
// export type UpdateTestCategoryInput = { id: string } & Partial<CreateTestCategoryInput>
// export type UpdateTestSpecInput = { id: string } & Partial<CreateTestSpecInput>
// export type UpdateTestInput = { id: string } & Partial<CreateTestInput>
