import {
    type TestCategory,
    type TestSpec,
    type TestRequirement,
    type Test,
    type CategoryWithStats,
    type SpecWithStats
} from '@/lib/types'
import { TEST_STATUSES } from '@/lib/constants'

const calculateSpecStats = (spec: TestSpec, requirements: TestRequirement[], tests: Test[]): SpecWithStats => {
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
        ...spec,
        passed,
        failed,
        pending,
        skipped,
        todo,
        total
    }
}

const calculateCategoryStats = (specs: SpecWithStats[], children: CategoryWithStats[]) => {
    let passed = 0
    let failed = 0
    let pending = 0
    let skipped = 0
    let todo = 0
    let total = 0

    // Add stats from specs
    specs.forEach((spec) => {
        passed += spec.passed
        failed += spec.failed
        pending += spec.pending
        skipped += spec.skipped
        todo += spec.todo
        total += spec.total
    })

    // Add stats from child categories
    children.forEach((child) => {
        passed += child.passed
        failed += child.failed
        pending += child.pending
        skipped += child.skipped
        todo += child.todo
        total += child.total
    })

    return { passed, failed, pending, skipped, todo, total }
}

export function buildCategoryHierarchy(
    categories: TestCategory[],
    specs: TestSpec[],
    requirements: TestRequirement[],
    tests: Test[]
): CategoryWithStats[] {
    // Build specs with stats
    const specsWithStats = specs.map((spec) => calculateSpecStats(spec, requirements, tests))

    // Build category hierarchy
    const buildCategory = (category: TestCategory): CategoryWithStats => {
        // Find child categories
        const childCategories = categories
            .filter((cat) => cat.parentCategoryId === category.id)
            .map((child) => buildCategory(child))

        // Find specs for this category
        const categorySpecs = specsWithStats.filter((spec) => spec.testCategoryId === category.id)

        // Calculate stats
        const stats = calculateCategoryStats(categorySpecs, childCategories)
        const status =
            stats.passed === stats.total ? TEST_STATUSES.passed
            : stats.passed > 0 ? TEST_STATUSES.pending
            : TEST_STATUSES.failed

        return {
            ...category,
            children: childCategories,
            specs: categorySpecs,
            ...stats,
            status
        }
    }

    // Build root categories (those without parent)
    const rootCategories = categories.filter((cat) => !cat.parentCategoryId).map((category) => buildCategory(category))

    return rootCategories
}

export function getSpecsWithoutCategories(
    specs: TestSpec[],
    requirements: TestRequirement[],
    tests: Test[]
): SpecWithStats[] {
    return specs.filter((spec) => !spec.testCategoryId).map((spec) => calculateSpecStats(spec, requirements, tests))
}
