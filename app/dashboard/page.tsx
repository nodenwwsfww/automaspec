'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { type TestSpec, type Test, type TestRequirement } from '@/lib/types'

import { DashboardHeader } from './header'
import { Tree } from './tree'
import { TestDetailsPanel } from './test-details-panel'
import { useDashboardData } from './hooks'

export default function Dashboard() {
    const [selectedSpec, setSelectedSpec] = useState<TestSpec | null>(null)
    const [selectedRequirements, setSelectedRequirements] = useState<TestRequirement[]>([])
    const [selectedTests, setSelectedTests] = useState<Test[]>([])

    // const [,setGroupEditorOpen] = useState(false)
    // const [,setTestEditorOpen] = useState(false)
    // const [,setEditingGroup] = useState<TestSpec | null>(null)
    // const [,setEditingTest] = useState<Test | null>(null)
    // const [,setParentGroup] = useState<TestSpec | null>(null)

    const { folders, specs, requirements, tests, loading } = useDashboardData()

    // const {
    //     handleDelete,
    //     createTestCategoryMutation,
    //     updateTestCategoryMutation,
    //     createTestSpecMutation,
    //     updateTestSpecMutation
    // } = useDashboardMutations(queryClient, selectedTest, setSelectedTest)

    const handleSpecSelect = (spec: TestSpec) => {
        const specRequirements = requirements.filter((req) => req.specId === spec.id)
        const specTests = tests.filter((test) => test.requirementId === spec.id)

        setSelectedSpec(spec)
        setSelectedRequirements(specRequirements)
        setSelectedTests(specTests)
    }

    // const handleRequirementSelect = (requirement: TestRequirement) => {
    //     setSelectedRequirement(requirement)
    // }

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
    //                 testFolderId: editingGroup.testFolderId
    //             })
    //         } else {
    //             // Create new spec
    //             await createTestSpecMutation.mutateAsync({
    //                 name: item.name,
    //                 title: item.title,
    //                 description: item.description,
    //                 status: item.status,
    //                 testFolderId: parentGroup?.id || folders[0]?.id
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

    // Tree will compute hierarchy and stats internally

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
                    <Tree
                        folders={folders}
                        specs={specs}
                        requirements={requirements}
                        tests={tests}
                        selectedSpecId={selectedSpec?.id || null}
                        onSelectSpec={handleSpecSelect}
                    />
                </div>
            </div>

            <div className="flex w-1/2 flex-col">
                <TestDetailsPanel
                    selectedSpec={selectedSpec}
                    selectedRequirements={selectedRequirements}
                    selectedTests={selectedTests}
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
