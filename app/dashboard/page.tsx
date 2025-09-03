'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Test, TreeNode } from '@/lib/types'

import { DashboardHeader } from './header'
import { TreeNodeComponent } from './tree-node'
import { TestDetailsPanel } from './test-details-panel'
import { useDashboardData } from './hooks'
import { buildHierarchy } from './hierarchy-utils'

export default function Dashboard() {
    const [selectedTest, setSelectedTest] = useState<Test | null>(null)
    // const [,setGroupEditorOpen] = useState(false)
    // const [,setTestEditorOpen] = useState(false)
    // const [,setEditingGroup] = useState<TestSpec | null>(null)
    // const [,setEditingTest] = useState<Test | null>(null)
    // const [,setParentGroup] = useState<TestSpec | null>(null)

    const { categories, specs, requirements, tests, loading } = useDashboardData()
    console.log(categories, specs, requirements, tests)

    // const {
    //     handleDelete,
    //     createTestCategoryMutation,
    //     updateTestCategoryMutation,
    //     createTestSpecMutation,
    //     updateTestSpecMutation
    // } = useDashboardMutations(queryClient, selectedTest, setSelectedTest)

    const handleTestSelect = (node: TreeNode) => {
        if (node.type === 'spec') {
            // When spec is selected, show spec info and all its requirements
            const specRequirements = requirements.filter((req) => req.testSpecId === node.id)

            // Attach test data and status to each requirement
            const requirementsWithTests = specRequirements.map((req) => {
                const test = tests.find((test) => test.testRequirementId === req.id)
                return {
                    ...req,
                    test: test,
                    status: test?.status || 'pending'
                }
            })

            // Get framework from the first test, or default to 'vitest'
            const firstTest = requirementsWithTests.find((req) => req.test)?.test
            const framework = firstTest?.framework || 'vitest'

            setSelectedTest({
                id: node.id,
                title: node.name,
                description: node.spec?.description || '',
                status: node.status,
                framework: framework,
                code: `// Spec: ${node.name}\n// Description: ${node.spec?.description || 'No description'}\n// Total tests: ${node.total}\n// Passed tests: ${node.passed}`,
                requirements: requirementsWithTests,
                testRequirementId: '',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            } as Test)
        } else if (node.type === 'test') {
            // When test is selected, show test info and its requirement
            setSelectedTest({
                ...node.test,
                title: node.requirement?.text || node.name,
                description: node.requirement?.description || '',
                requirements: node.requirement ? [node.requirement] : []
            } as Test)
        }
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
    // @ts-ignore FIXME
    const allTests = buildHierarchy(categories, specs, requirements, tests)

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

    return (
        <div className="flex h-screen bg-background">
            <div className="flex w-1/2 flex-col border-r">
                <DashboardHeader onCreateGroup={() => {}} onCreateTest={() => {}} />

                <div className="flex-1 overflow-auto p-2">
                    {allTests.map((node: TreeNode) => (
                        <TreeNodeComponent
                            key={node.id}
                            node={node}
                            onAddChild={() => {}}
                            onDelete={() => {}}
                            onEdit={() => {}}
                            onSelect={handleTestSelect}
                            selectedId={selectedTest?.id || null}
                        />
                    ))}
                </div>
            </div>

            <div className="flex w-1/2 flex-col">
                <TestDetailsPanel
                    selectedTest={selectedTest}
                    onEditTest={() => {}}
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
