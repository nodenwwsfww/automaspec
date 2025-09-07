'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { Edit, FileText, Trash2, Check, Copy, Plus, Folder } from 'lucide-react'
import { SelectedSpec, Test, TestRequirement, type TestStatus } from '@/lib/types'
import { STATUS_CONFIGS, TEST_STATUSES } from '@/lib/constants'

interface RequirementWithTest extends TestRequirement {
    test?: Test
    status?: TestStatus
}
interface TestDetailsPanelProps {
    selectedSpec: SelectedSpec | null
    onEditSpec: (spec: SelectedSpec) => void
    onCreateGroup: () => void
    onCreateTest: () => void
}

export function TestDetailsPanel({ selectedSpec, onEditSpec, onCreateGroup, onCreateTest }: TestDetailsPanelProps) {
    const [copied, setCopied] = useState(false)
    const [editingRequirements, setEditingRequirements] = useState(false)
    const [, setRequirementsContent] = useState('')

    const copyTestCode = async () => {
        if (selectedSpec) {
            // Generate test code from the spec and its requirements
            const testCode = generateTestCode(selectedSpec)
            await navigator.clipboard.writeText(testCode)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    const generateTestCode = (spec: SelectedSpec): string => {
        const requirements = spec.requirements
            .map((req) => {
                const testStatus = req.test?.status || 'pending'
                const testCode = req.test?.code || `// TODO: Implement test for ${req.name}`
                return `  it('${req.name}', () => {
    // ${req.description || 'No description'}
    // Status: ${testStatus}
    ${testCode}
  })`
            })
            .join('\n\n')

        return `describe('${spec.name}', () => {
  // ${spec.description || 'No description'}
  // Total requirements: ${spec.requirements.length}
  // Passed tests: ${spec.requirements.filter((r) => r.status === 'passed').length}

${requirements}
})`
    }

    const saveRequirements = () => {
        // In real app, would save to database
        if (selectedSpec) {
            // This would update the requirements in the database
            // For now, we'll just close the editing mode
            // console.log('Saving requirements:', requirementsContent)
        }
        setEditingRequirements(false)
    }

    if (!selectedSpec) {
        return (
            <div className="flex flex-1 items-center justify-center text-muted-foreground">
                <div className="text-center">
                    <FileText className="mx-auto mb-4 h-12 w-12 opacity-50" />
                    <p>Select a spec to view details and requirements</p>
                    <div className="mt-4 flex gap-2">
                        <Button variant="outline" onClick={onCreateGroup}>
                            <Folder className="mr-2 h-4 w-4" />
                            Create Group
                        </Button>
                        <Button onClick={onCreateTest}>
                            <Plus className="mr-2 h-4 w-4" />
                            Create Test
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="border-b p-4">
                <div className="mb-2 flex items-start justify-between">
                    <div>
                        <div className="mb-1 flex items-center gap-2">
                            <h2 className="font-semibold text-xl">{selectedSpec.name}</h2>
                            <Button onClick={() => onEditSpec(selectedSpec)} size="sm" variant="ghost">
                                <Edit className="h-4 w-4" />
                            </Button>
                        </div>
                        <p className="mb-2 text-muted-foreground text-sm">{selectedSpec.description}</p>
                        <div className="flex items-center gap-2">
                            <Badge variant="outline">{selectedSpec.status}</Badge>
                            <Badge variant="outline">{selectedSpec.fileName || 'No file'}</Badge>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-auto p-4">
                <Tabs className="h-full" defaultValue="requirements">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="requirements">Functional Requirements</TabsTrigger>
                        <TabsTrigger value="vitest">Code</TabsTrigger>
                    </TabsList>

                    <TabsContent className="mt-4 space-y-4" value="requirements">
                        <div>
                            <div className="mb-3 flex items-center justify-between">
                                <h3 className="font-medium">Test Requirements</h3>
                                <Button
                                    onClick={() => setEditingRequirements(!editingRequirements)}
                                    size="sm"
                                    variant="outline"
                                >
                                    <Edit className="mr-1 h-4 w-4" />
                                    {editingRequirements ? 'Cancel' : 'Edit'}
                                </Button>
                            </div>

                            {selectedSpec.requirements.length > 0 && (
                                <div className="mb-4 rounded-lg bg-muted/30 p-3">
                                    <div className="flex items-center gap-4 text-sm">
                                        {Object.values(TEST_STATUSES).map((status) => {
                                            const count = selectedSpec.requirements.filter(
                                                (req: RequirementWithTest) => req.status === status
                                            ).length

                                            if (count === 0) return null

                                            const statusConfig = STATUS_CONFIGS[status]
                                            const IconComponent = statusConfig.icon

                                            return (
                                                <div key={status} className="flex items-center gap-1">
                                                    <IconComponent className={`h-4 w-4 ${statusConfig.color}`} />
                                                    <span className="font-medium">
                                                        {count} {statusConfig.label}
                                                    </span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}

                            {editingRequirements ?
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        {selectedSpec.requirements.map((req: RequirementWithTest, index: number) => (
                                            <div
                                                key={req.id || index}
                                                className="flex items-center gap-2 rounded-lg border p-3"
                                            >
                                                <input
                                                    className="flex-1 bg-transparent outline-none"
                                                    onChange={(e) => {
                                                        const updatedReqs = [...selectedSpec.requirements]
                                                        updatedReqs[index] = {
                                                            ...req,
                                                            name: e.target.value
                                                        } as RequirementWithTest
                                                        setRequirementsContent(
                                                            updatedReqs
                                                                .map((r: RequirementWithTest) => r.name)
                                                                .join('\n')
                                                        )
                                                    }}
                                                    placeholder="Enter requirement..."
                                                    value={req.name || ''}
                                                />
                                                <Button
                                                    onClick={() => {
                                                        const updatedReqs = selectedSpec.requirements.filter(
                                                            (_: any, i: number) => i !== index
                                                        )
                                                        setRequirementsContent(
                                                            updatedReqs.map((r: any) => r.name).join('\n')
                                                        )
                                                    }}
                                                    size="sm"
                                                    variant="ghost"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                        <Button
                                            onClick={() => {
                                                const newReq = {
                                                    id: `req-${Date.now()}`,
                                                    name: '',
                                                    description: null,
                                                    order: selectedSpec.requirements.length,
                                                    testSpecId: selectedSpec.id,
                                                    createdAt: new Date(),
                                                    updatedAt: new Date()
                                                }
                                                const updatedReqs = [...selectedSpec.requirements, newReq]
                                                setRequirementsContent(updatedReqs.map((r: any) => r.name).join('\n'))
                                            }}
                                            size="sm"
                                            variant="outline"
                                        >
                                            <Plus className="mr-2 h-4 w-4" />
                                            Add Requirement
                                        </Button>
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <Button onClick={() => setEditingRequirements(false)} variant="outline">
                                            Cancel
                                        </Button>
                                        <Button onClick={saveRequirements}>Save Requirements</Button>
                                    </div>
                                </div>
                            :   <div className="space-y-2">
                                    {selectedSpec.requirements.map((req: RequirementWithTest, index: number) => {
                                        const config = STATUS_CONFIGS[(req.status || 'pending') as TestStatus]
                                        const IconComponent = config.icon
                                        const badge = (
                                            <Badge className={config.requirementClassName}>
                                                <IconComponent className="h-4 w-4 mr-1" />
                                                {config.label}
                                            </Badge>
                                        )
                                        const color = config.requirementClassName || config.color
                                        return (
                                            <div
                                                className={cn('flex items-start gap-3 rounded-lg border p-3', color)}
                                                key={req.id || index}
                                            >
                                                <div className="mt-0.5">{badge}</div>
                                                <div className="flex-1">
                                                    <span className="font-medium text-sm">{req.name}</span>
                                                    {req.description && (
                                                        <div className="mt-1 text-muted-foreground text-xs">
                                                            {req.description}
                                                        </div>
                                                    )}
                                                    <div className="mt-1 text-muted-foreground text-xs">
                                                        Status:{' '}
                                                        <span className="capitalize">{req.status || 'pending'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                    {selectedSpec.requirements.length === 0 && (
                                        <div className="text-muted-foreground text-sm">No requirements defined</div>
                                    )}
                                </div>
                            }
                        </div>
                    </TabsContent>

                    <TabsContent className="mt-4" value="vitest">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="font-medium">Generated Test Code</h3>
                                <Button onClick={copyTestCode} size="sm">
                                    {copied ?
                                        <>
                                            <Check className="mr-1 h-4 w-4" />
                                            Copied!
                                        </>
                                    :   <>
                                            <Copy className="mr-1 h-4 w-4" />
                                            Copy Test Code
                                        </>
                                    }
                                </Button>
                            </div>
                            <div className="max-h-[500px] overflow-auto rounded-lg bg-slate-950 p-4 font-mono text-slate-50 text-sm">
                                <pre className="whitespace-pre-wrap">{generateTestCode(selectedSpec)}</pre>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </>
    )
}
