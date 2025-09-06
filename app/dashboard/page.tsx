'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { SelectedSpec, TreeNode, TestStatus } from '@/lib/types'

import { DashboardHeader } from './header'
import { TreeNodeComponent } from './tree-node'
import { TestDetailsPanel } from './test-details-panel'
import { useDashboardData } from './hooks'
import { buildHierarchy } from './hierarchy-utils'

export default function Dashboard() {
    const [selectedSpec, setSelectedSpec] = useState<SelectedSpec | null>(null)
    // const [,setGroupEditorOpen] = useState(false)
    // const [,setTestEditorOpen] = useState(false)
    // const [,setEditingGroup] = useState<TestSpec | null>(null)
    // const [,setEditingTest] = useState<Test | null>(null)
    // const [,setParentGroup] = useState<TestSpec | null>(null)

    const { categories, specs, requirements, tests, loading } = useDashboardData()

    // Debug: Log the data to see what we're getting
    if (!loading) {
        console.log('Categories:', categories.length)
        console.log('Specs:', specs.length)
        console.log('Requirements:', requirements.length)
        console.log('Tests:', tests.length)
        if (requirements.length > 0) {
            console.log('First requirement:', requirements[0])
        }
    }

    // const {
    //     handleDelete,
    //     createTestCategoryMutation,
    //     updateTestCategoryMutation,
    //     createTestSpecMutation,
    //     updateTestSpecMutation
    // } = useDashboardMutations(queryClient, selectedTest, setSelectedTest)

    const handleSpecSelect = (node: TreeNode) => {
        if (node.type === 'spec' && node.spec) {
            console.log('Selecting spec:', node.spec.name, 'ID:', node.id)

            // When spec is selected, show spec info and all its requirements
            const specRequirements = requirements.filter((req) => req.testSpecId === node.id)
            console.log(`Found ${specRequirements.length} requirements for spec ${node.spec.name}`)

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
                ...node.spec,
                requirements: requirementsWithTests
            })
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
                            onSelect={handleSpecSelect}
                            selectedId={selectedSpec?.id || null}
                        />
                    ))}
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
