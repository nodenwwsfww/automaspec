import { TreeNode, TestCategory, TestSpec, TestRequirement, Test } from '@/lib/types'
import { FileText, Folder } from 'lucide-react'

export function buildHierarchy(categories: any[], specs: any[], requirements: any[], tests: any[]): TreeNode[] {
    // Helper function to calculate test stats
    const calculateStats = (children: any[]) => {
        let passed = 0
        let total = 0

        children.forEach((child: any) => {
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
    const categoriesWithSpecs = categories.map((category: any) => {
        const categorySpecs = specs
            .filter((spec: any) => spec.testCategoryId === category.id)
            .map((spec: any) => {
                // Calculate stats for the spec based on its requirements
                const specRequirements = requirements.filter((req: any) => req.testSpecId === spec.id)
                let passed = 0
                let total = specRequirements.length

                specRequirements.forEach((requirement: any) => {
                    const test = tests.find((test: any) => test.testRequirementId === requirement.id)
                    if (test?.status === 'passed') passed += 1
                })

                return {
                    id: spec.id,
                    name: spec.name || spec.title || 'Untitled Spec',
                    type: 'spec' as const,
                    icon: FileText,
                    children: [], // No children - requirements shown in right panel
                    passed: passed,
                    total: total,
                    status: (passed === total && total > 0 ? 'passed'
                    : passed > 0 ? 'warning'
                    : 'failed') as any,
                    spec: spec
                }
            })

        const categoryStats = calculateStats(categorySpecs)
        return {
            id: category.id,
            name: category.name || category.title || 'Untitled Category',
            type: 'category' as const,
            icon: Folder,
            children: categorySpecs,
            passed: categoryStats.passed,
            total: categoryStats.total,
            status: (categoryStats.passed === categoryStats.total ? 'passed'
            : categoryStats.passed > 0 ? 'warning'
            : 'failed') as any,
            category: category
        }
    })

    return categoriesWithSpecs
}
