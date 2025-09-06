'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { SelectedSpec, TestStatus, CategoryWithStats, SpecWithStats } from '@/lib/types'

import { DashboardHeader } from './header'
import { CategoryComponent } from './category'
import { SpecComponent } from './spec'
import { TestDetailsPanel } from './test-details-panel'
import { useDashboardData } from './hooks'
import { buildCategoryHierarchy, getSpecsWithoutCategories } from './hierarchy-utils'

export default function Dashboard() {
    const [selectedSpec, setSelectedSpec] = useState<SelectedSpec | null>(null)
    // const [,setGroupEditorOpen] = useState(false)
    // const [,setTestEditorOpen] = useState(false)
    // const [,setEditingGroup] = useState<TestSpec | null>(null)
    // const [,setEditingTest] = useState<Test | null>(null)
    // const [,setParentGroup] = useState<TestSpec | null>(null)

    const { categories, specs, requirements, tests, loading } = useDashboardData()

    // const {
    //     handleDelete,
    //     createTestCategoryMutation,
    //     updateTestCategoryMutation,
    //     createTestSpecMutation,
    //     updateTestSpecMutation
    // } = useDashboardMutations(queryClient, selectedTest, setSelectedTest)

    const handleSpecSelect = (spec: SpecWithStats) => {
        // When spec is selected, show spec info and all its requirements
        const specRequirements = requirements.filter((req) => req.testSpecId === spec.id)

        // Attach test data and status to each requirement
        const requirementsWithTests = specRequirements.map((req) => {
            const test = tests.find((test) => test.testRequirementId === req.id)
            return {
                ...req,
                test: test,
                status: (test?.status || 'pending') as TestStatus
            }
        })

        setSelectedSpec({
            ...spec,
            requirements: requirementsWithTests
        })
    }

    // const handleCreateGroup = () => {
    //     setEditingGroup(null)
    //     setParentGroup(null)
    //     setGroupEditorOpen(true)
    // }

    // const handleCreateTest = () => {
    //     setEditingGroup(null)
    //     setParentGroup(null)
    //     setGroupEditorOpen(true)
    // }

    // const handleEditGroup = (group: any) => {
    //     setEditingGroup(group.group || group.category)
    //     setParentGroup(null)
    //     setGroupEditorOpen(true)
    // }

    // const handleAddChild = (parentNode: any) => {
    //     setEditingGroup(null)
    //     setParentGroup(parentNode.group || parentNode.category)
    //     setGroupEditorOpen(true)
    // }

    // const handleEditTest = (test: any) => {
    //     setEditingTest(test.test || test)
    //     setTestEditorOpen(true)
    // }

    // const handleSaveGroup = async (item: any) => {
    //     if (item.type === 'group') {
    //         if (editingGroup) {
    //             // Update existing category
    //             await updateTestCategoryMutation.mutateAsync({
    //                 id: editingGroup.id,
    //                 name: item.name,
    //                 title: item.title,
    //                 description: item.description
    //             })
    //         } else {
    //             // Create new category
    //             await createTestCategoryMutation.mutateAsync({
    //                 name: item.name,
    //                 title: item.title,
    //                 description: item.description,
    //                 parentCategoryId: parentGroup?.id || null,
    //                 order: 0
    //             })
    //         }
    //     } else if (item.type === 'spec') {
    //         if (editingGroup) {
    //             // Update existing spec
    //             await updateTestSpecMutation.mutateAsync({
    //                 id: editingGroup.id,
    //                 name: item.name,
    //                 title: item.title,
    //                 description: item.description,
    //                 status: item.status,
    //                 testCategoryId: editingGroup.testCategoryId
    //             })
    //         } else {
    //             // Create new spec
    //             await createTestSpecMutation.mutateAsync({
    //                 name: item.name,
    //                 title: item.title,
    //                 description: item.description,
    //                 status: item.status,
    //                 testCategoryId: parentGroup?.id || categories[0]?.id
    //             })
    //         }
    //     }

    //     setEditingGroup(null)
    //     setParentGroup(null)
    // }

    // const handleSaveTest = (_test: any) => {
    //     queryClient.invalidateQueries({ queryKey: ['tests'] })
    //     setEditingTest(null)
    // }

    // Build hierarchical structure from flat data for display
    const categoriesWithStats = buildCategoryHierarchy(categories, specs, requirements, tests)
    const specsWithoutCategories = getSpecsWithoutCategories(specs, requirements, tests)

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <div className="flex items-center gap-2">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span>Loading...</span>
                </div>
            </div>
        )
    }

    const renderCategory = (category: CategoryWithStats, level = 0) => (
        <CategoryComponent
            key={category.id}
            category={category}
            level={level}
            onEdit={() => {}}
            onAddChild={() => {}}
            onDelete={() => {}}
            onAddSpec={() => {}}
        >
            {/* Render child categories */}
            {category.children.map((child) => renderCategory(child, level + 1))}
            {/* Render specs in this category */}
            {category.specs.map((spec) => (
                <SpecComponent
                    key={spec.id}
                    spec={spec}
                    level={level + 1}
                    onSelect={handleSpecSelect}
                    onEdit={() => {}}
                    onDelete={() => {}}
                    onAddRequirement={() => {}}
                    selectedId={selectedSpec?.id || null}
                />
            ))}
        </CategoryComponent>
    )

    return (
        <div className="flex h-screen bg-background">
            <div className="flex w-1/2 flex-col border-r">
                <DashboardHeader onCreateGroup={() => {}} onCreateTest={() => {}} />

                <div className="flex-1 overflow-auto p-2">
                    {/* Render specs without categories first */}
                    {specsWithoutCategories.map((spec) => (
                        <SpecComponent
                            key={spec.id}
                            spec={spec}
                            level={0}
                            onSelect={handleSpecSelect}
                            onEdit={() => {}}
                            onDelete={() => {}}
                            onAddRequirement={() => {}}
                            selectedId={selectedSpec?.id || null}
                        />
                    ))}

                    {/* Render categories with their nested structure */}
                    {categoriesWithStats.map((category) => renderCategory(category))}
                </div>
            </div>

            <div className="flex w-1/2 flex-col">
                <TestDetailsPanel
                    selectedSpec={selectedSpec}
                    onEditSpec={() => {}}
                    onCreateGroup={() => {}}
                    onCreateTest={() => {}}
                />
            </div>

            {/* <GroupEditorModal
                group={editingGroup}
                onOpenChange={setGroupEditorOpen}
                onSave={handleSaveGroup}
                open={groupEditorOpen}
            />

            <TestEditorModal
                onOpenChange={setTestEditorOpen}
                onSave={handleSaveTest}
                open={testEditorOpen}
                test={editingTest}
            /> */}
        </div>
    )
}
