import type { TestStatus, TestFramework, TreeNode } from '@/lib/types'
import { expect, test, describe } from 'vitest'

describe('Types', () => {
    test('TestStatus type has correct values', () => {
        const validStatuses: TestStatus[] = ['pending', 'passed', 'failed', 'warning', 'skipped']

        // Test that each status is a valid string
        validStatuses.forEach((status) => {
            expect(typeof status).toBe('string')
            expect(status.length).toBeGreaterThan(0)
        })
    })

    test('TestFramework type has correct values', () => {
        const framework: TestFramework = 'Vitest'
        expect(framework).toBe('Vitest')
    })

    test('TreeNode interface has required properties', () => {
        const treeNode: TreeNode = {
            id: 'test-id',
            name: 'Test Node',
            type: 'category'
        }

        expect(treeNode).toHaveProperty('id')
        expect(treeNode).toHaveProperty('name')
        expect(treeNode).toHaveProperty('type')
        expect(treeNode.id).toBe('test-id')
        expect(treeNode.name).toBe('Test Node')
        expect(treeNode.type).toBe('category')
    })

    test('TreeNode supports all types', () => {
        const categoryNode: TreeNode = { id: '1', name: 'Category', type: 'category' }
        const specNode: TreeNode = { id: '2', name: 'Spec', type: 'spec' }
        const testNode: TreeNode = { id: '3', name: 'Test', type: 'test' }

        expect(categoryNode.type).toBe('category')
        expect(specNode.type).toBe('spec')
        expect(testNode.type).toBe('test')
    })

    test('TreeNode can have optional properties', () => {
        const nodeWithStats: TreeNode = {
            id: 'test-id',
            name: 'Test Node',
            type: 'category',
            passed: 5,
            total: 10,
            status: 'failed',
            children: []
        }

        expect(nodeWithStats.passed).toBe(5)
        expect(nodeWithStats.total).toBe(10)
        expect(nodeWithStats.status).toBe('failed')
        expect(Array.isArray(nodeWithStats.children)).toBe(true)
    })
})
