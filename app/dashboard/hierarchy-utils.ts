import {
    type TreeNode,
    type TestCategory,
    type TestSpec,
    type TestRequirement,
    type Test,
    type SpecStatus
} from '@/lib/types'
import { FileText, Folder } from 'lucide-react'
import { TEST_STATUSES } from '@/lib/constants'

const calculateDetailedStats = (children: TreeNode[]) => {
    let passed = 0
    let failed = 0
    let pending = 0
    let skipped = 0
    let todo = 0
    let total = 0

    children.forEach((child) => {
        if (child.type === 'spec') {
            // For specs, use their pre-calculated stats
            passed += child.passed || 0
            failed += child.failed || 0
            pending += child.pending || 0
            skipped += child.skipped || 0
            todo += child.todo || 0
            total += child.total || 0
        } else if (child.children) {
            const childStats = calculateDetailedStats(child.children)
            passed += childStats.passed || 0
            failed += childStats.failed || 0
            pending += childStats.pending || 0
            skipped += childStats.skipped || 0
            todo += childStats.todo || 0
            total += childStats.total
        }
    })

    return { passed, failed, pending, skipped, todo, total }
}

export function buildHierarchy(
    categories: TestCategory[],
    specs: TestSpec[],
    requirements: TestRequirement[],
    tests: Test[]
): TreeNode[] {
    // Create a map of categories with their specs
    const categoriesWithSpecs = categories.map((category) => {
        const categorySpecs = specs
            .filter((spec) => spec.testCategoryId === category.id)
            .map((spec) => {
                // Calculate detailed stats for the spec based on its requirements
                const specRequirements = requirements.filter((req) => req.testSpecId === spec.id)
                let passed = 0
                let failed = 0
                let pending = 0
                let skipped = 0
                let todo = 0
                const total = specRequirements.length

                specRequirements.forEach((requirement) => {
                    const test = tests.find((test) => test.testRequirementId === requirement.id)
                    if (test?.status === TEST_STATUSES.passed) passed += 1
                    else if (test?.status === TEST_STATUSES.failed) failed += 1
                    else if (test?.status === TEST_STATUSES.pending) pending += 1
                    else if (test?.status === TEST_STATUSES.skipped) skipped += 1
                    else if (test?.status === TEST_STATUSES.todo) todo += 1
                })

                return {
                    id: spec.id,
                    name: spec.name,
                    type: 'spec' as const,
                    icon: FileText,
                    children: [], // No children - requirements shown in right panel
                    passed: passed,
                    failed: failed,
                    pending: pending,
                    skipped: skipped,
                    todo: todo,
                    total: total,
                    status: spec.status as SpecStatus,
                    spec: spec
                }
            })

        const categoryStats = calculateDetailedStats(categorySpecs)

        return {
            id: category.id,
            name: category.name,
            type: 'category' as const,
            icon: Folder,
            children: categorySpecs,
            passed: categoryStats.passed,
            failed: categoryStats.failed,
            pending: categoryStats.pending,
            skipped: categoryStats.skipped,
            todo: categoryStats.todo,
            total: categoryStats.total,
            status:
                categoryStats.passed === categoryStats.total ? TEST_STATUSES.passed
                : categoryStats.passed > 0 ? TEST_STATUSES.pending
                : TEST_STATUSES.failed,
            category: category
        }
    })

    return categoriesWithSpecs
}
