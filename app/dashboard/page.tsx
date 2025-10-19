'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { type TestSpec, type Test, type TestRequirement } from '@/lib/types'
import { DashboardHeader } from './header'
import { Tree } from './tree'
import { TestDetailsPanel } from './test-details-panel'
import { useFolders, useSpecs, useRequirements, useTests } from './hooks'

export default function Dashboard() {
    const [selectedSpec, setSelectedSpec] = useState<TestSpec | null>(null)
    const [selectedRequirements, setSelectedRequirements] = useState<TestRequirement[]>([])
    const [selectedTests, setSelectedTests] = useState<Test[]>([])

    const { folders, foldersLoading } = useFolders('folder-1') // FIXME: use the actual folder id
    const { specs, specsLoading } = useSpecs(folders[0]?.id)
    const { requirements, requirementsLoading } = useRequirements(specs[0]?.id)
    const { tests, testsLoading } = useTests(requirements[0]?.id)

    const loading = foldersLoading || specsLoading || requirementsLoading || testsLoading

    const handleSpecSelect = (spec: TestSpec) => {
        const specRequirements = requirements.filter((req) => req.specId === spec.id)
        const specTests = tests.filter((test) => test.requirementId === spec.id)

        setSelectedSpec(spec)
        setSelectedRequirements(specRequirements)
        setSelectedTests(specTests)
    }

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
