'use client'

import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { Test, TestSpec, TreeNode } from '@/lib/types'
import { GroupEditorModal } from '@/components/group-editor-modal'
import { TestEditorModal } from '@/components/test-editor-modal'
import { DashboardHeader } from './dashboard-header'
import { TreeNodeComponent } from './tree-node'
import { TestDetailsPanel } from './test-details-panel'
import { useDashboardData, useDashboardMutations } from './hooks'
import { buildHierarchy } from './hierarchy-utils'

export default function Dashboard() {
    const queryClient = useQueryClient()
    const [selectedTest, setSelectedTest] = useState<Test | null>(null)
    const [groupEditorOpen, setGroupEditorOpen] = useState(false)
    const [testEditorOpen, setTestEditorOpen] = useState(false)
    const [editingGroup, setEditingGroup] = useState<TestSpec | null>(null)
    const [editingTest, setEditingTest] = useState<Test | null>(null)
    const [parentGroup, setParentGroup] = useState<TestSpec | null>(null)

    // Use custom hooks for data fetching
    const { categories, specs, requirements, tests, loading } = useDashboardData()

    // Use custom hooks for mutations
    const {
        handleDelete,
        createTestCategoryMutation,
        updateTestCategoryMutation,
        createTestSpecMutation,
        updateTestSpecMutation
    } = useDashboardMutations(queryClient, selectedTest, setSelectedTest)

    const handleTestSelect = (node: TreeNode) => {
        if (node.type === 'spec') {
            // When spec is selected, show spec info and all its requirements
            const specRequirements = requirements.filter((req: any) => req.testSpecId === node.id)

            // Attach test data and status to each requirement
            const requirementsWithTests = specRequirements.map((req: any) => {
                const test = tests.find((test: any) => test.testRequirementId === req.id)
                return {
                    ...req,
                    test: test,
                    status: test?.status || 'pending'
                }
            })

            // Get framework from the first test, or default to 'vitest'
            const firstTest = requirementsWithTests.find((req: any) => req.test)?.test
            const framework = firstTest?.framework || 'vitest'

            setSelectedTest({
                id: node.id,
                title: node.name,
                description: node.spec?.description || '',
                status: node.status,
                framework: framework,
                code: `// Spec: ${node.name}\n// Description: ${node.spec?.description || 'No description'}\n// Total tests: ${node.total}\n// Passed tests: ${node.passed}`,
                requirements: requirementsWithTests as any,
                testRequirementId: '',
                createdAt: new Date(),
                updatedAt: new Date()
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

    const handleCreateGroup = () => {
        setEditingGroup(null)
        setParentGroup(null)
        setGroupEditorOpen(true)
    }

    const handleCreateTest = () => {
        setEditingGroup(null)
        setParentGroup(null)
        setGroupEditorOpen(true)
    }

    const handleEditGroup = (group: any) => {
        setEditingGroup(group.group || group.category)
        setParentGroup(null)
        setGroupEditorOpen(true)
    }

    const handleAddChild = (parentNode: any) => {
        setEditingGroup(null)
        setParentGroup(parentNode.group || parentNode.category)
        setGroupEditorOpen(true)
    }

    const handleEditTest = (test: any) => {
        setEditingTest(test.test || test)
        setTestEditorOpen(true)
    }

    const handleSaveGroup = async (item: any) => {
        if (item.type === 'group') {
            if (editingGroup) {
                // Update existing category
                await updateTestCategoryMutation.mutateAsync({
                    id: editingGroup.id,
                    name: item.name,
                    title: item.title,
                    description: item.description
                })
            } else {
                // Create new category
                await createTestCategoryMutation.mutateAsync({
                    name: item.name,
                    title: item.title,
                    description: item.description,
                    parentCategoryId: parentGroup?.id || null,
                    order: 0
                })
            }
        } else if (item.type === 'spec') {
            if (editingGroup) {
                // Update existing spec
                await updateTestSpecMutation.mutateAsync({
                    id: editingGroup.id,
                    name: item.name,
                    title: item.title,
                    description: item.description,
                    status: item.status,
                    testCategoryId: editingGroup.testCategoryId
                })
            } else {
                // Create new spec
                await createTestSpecMutation.mutateAsync({
                    name: item.name,
                    title: item.title,
                    description: item.description,
                    status: item.status,
                    testCategoryId: parentGroup?.id || categories[0]?.id
                })
            }
        }

        setEditingGroup(null)
        setParentGroup(null)
    }

    const handleSaveTest = (_test: any) => {
        queryClient.invalidateQueries({ queryKey: ['tests'] })
        setEditingTest(null)
    }

    // Build hierarchical structure from flat data for display
    const allTests = buildHierarchy(categories, specs, requirements, tests)

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <div className="flex items-center gap-2">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span>Loading test data...</span>
                </div>
            </div>
        )
    }

    return (
        <div className="flex h-screen bg-background">
            {/* Left Panel - Tree Structure */}
            <div className="flex w-1/2 flex-col border-r">
                <DashboardHeader onCreateGroup={handleCreateGroup} onCreateTest={handleCreateTest} />

                <div className="flex-1 overflow-auto p-2">
                    {allTests.map((node: TreeNode) => (
                        <TreeNodeComponent
                            key={node.id}
                            node={node}
                            onAddChild={handleAddChild}
                            onDelete={handleDelete}
                            onEdit={handleEditGroup}
                            onSelect={handleTestSelect}
                            selectedId={selectedTest?.id || null}
                        />
                    ))}
                </div>
            </div>

            {/* Right Panel - Test Details */}
            <div className="flex w-1/2 flex-col">
                <TestDetailsPanel
                    selectedTest={selectedTest}
                    onEditTest={handleEditTest}
                    onCreateGroup={handleCreateGroup}
                    onCreateTest={handleCreateTest}
                />
            </div>

            {/* Modals */}
            <GroupEditorModal
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
            />
        </div>
    )
}
