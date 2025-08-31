import {
    TreeNode,
    TestStatus,
    SpecStatus,
    TestCategory,
    type TestSpec,
    type TestRequirement,
    type Test
} from '@/lib/types'
import { FileText, Folder } from 'lucide-react'

export function buildHierarchy(
    categories: TestCategory[],
    specs: TestSpec[],
    requirements: TestRequirement[],
    tests: Test[]
): TreeNode[] {
    const calculateStats = (children: TreeNode[]) => {
        let passed = 0
        let total = 0

        children.forEach((child) => {
            if (child.type === 'test') {
                total += 1
                if (child.status === 'passed') passed += 1
            } else if (child.type === 'spec') {
                // For specs, use their pre-calculated stats
                passed += child.passed || 0
                total += child.total || 0
            } else if (child.children) {
                const childStats = calculateStats(child.children)
                passed += childStats.passed
                total += childStats.total
            }
        })

        return { passed, total }
    }

    // Create a map of categories with their specs
    const categoriesWithSpecs = categories.map((category) => {
        const categorySpecs = specs
            .filter((spec) => (spec as { testCategoryId: string }).testCategoryId === (category as { id: string }).id)
            .map((spec) => {
                // Calculate stats for the spec based on its requirements
                const specRequirements = requirements.filter(
                    (req) => (req as { testSpecId: string }).testSpecId === (spec as { id: string }).id
                )
                let passed = 0
                const total = specRequirements.length

                specRequirements.forEach((requirement) => {
                    const test = tests.find(
                        (test) =>
                            (test as { testRequirementId: string }).testRequirementId ===
                            (requirement as { id: string }).id
                    )
                    if ((test as { status?: string })?.status === 'passed') passed += 1
                })

                return {
                    id: (spec as { id: string }).id,
                    name:
                        (spec as { name?: string; title?: string }).name ||
                        (spec as { title?: string }).title ||
                        'Untitled Spec',
                    type: 'spec' as const,
                    icon: FileText,
                    children: [], // No children - requirements shown in right panel
                    passed: passed,
                    total: total,
                    status: (spec as { status?: string }).status as SpecStatus,
                    spec: spec as any
                }
            })

        const categoryStats = calculateStats(categorySpecs)
        return {
            id: (category as { id: string }).id,
            name:
                (category as { name?: string; title?: string }).name ||
                (category as { title?: string }).title ||
                'Untitled Category',
            type: 'category' as const,
            icon: Folder,
            children: categorySpecs,
            passed: categoryStats.passed,
            total: categoryStats.total,
            status: (categoryStats.passed === categoryStats.total ? 'passed'
            : categoryStats.passed > 0 ? 'pending'
            : 'failed') as TestStatus,
            category: category as any
        }
    })

    return categoriesWithSpecs
}
