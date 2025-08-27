'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { Edit, FileText, Trash2, Check, Copy, Plus, Folder } from 'lucide-react'
import { Test, TestRequirement } from '@/lib/types'
import { getStatusBadge, getRequirementStatusIcon, getRequirementStatusColor } from './utils'
import { TEST_STATUSES, getStatusConfig } from '@/lib/constants'

interface RequirementWithTest extends TestRequirement {
    test?: Test
    status?: string
}

interface TestDetailsPanelProps {
    selectedTest: Test | null
    onEditTest: (test: Test) => void
    onCreateGroup: () => void
    onCreateTest: () => void
}

export function TestDetailsPanel({ selectedTest, onEditTest, onCreateGroup, onCreateTest }: TestDetailsPanelProps) {
    const [copied, setCopied] = useState(false)
    const [editingRequirements, setEditingRequirements] = useState(false)
    const [requirementsContent, setRequirementsContent] = useState('')

    const copyTestCode = async () => {
        if (selectedTest?.code) {
            await navigator.clipboard.writeText(selectedTest.code)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    const saveRequirements = () => {
        // In real app, would save to database
        if (selectedTest) {
            selectedTest.requirements = requirementsContent
                .split('\n')
                .filter((req) => req.trim())
                .map((req: string, index: number) => ({
                    id: `req-${index + 1}`,
                    text: req,
                    description: null,
                    order: index,
                    testSpecId: selectedTest.id,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }))
        }
        setEditingRequirements(false)
    }

    if (!selectedTest) {
        return (
            <div className="flex flex-1 items-center justify-center text-muted-foreground">
                <div className="text-center">
                    <FileText className="mx-auto mb-4 h-12 w-12 opacity-50" />
                    <p>Select a test to view details and code</p>
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
                            <h2 className="font-semibold text-xl">{selectedTest.title}</h2>
                            <Button onClick={() => onEditTest(selectedTest)} size="sm" variant="ghost">
                                <Edit className="h-4 w-4" />
                            </Button>
                        </div>
                        <p className="mb-2 text-muted-foreground text-sm">{selectedTest.description}</p>
                        <div className="flex items-center gap-2">
                            <Badge variant="outline">{selectedTest.framework}</Badge>
                            {selectedTest.status &&
                                (selectedTest.status as string) !== 'default' &&
                                getStatusBadge(selectedTest.status)}
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

                            {(selectedTest.requirements || []).length > 0 && (
                                <div className="mb-4 rounded-lg bg-muted/30 p-3">
                                    <div className="flex items-center gap-4 text-sm">
                                        {TEST_STATUSES.map((status) => {
                                            const count = (selectedTest.requirements || []).filter(
                                                (req: RequirementWithTest) => req.status === status
                                            ).length

                                            if (count === 0) return null

                                            const statusConfig = getStatusConfig(status)
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
                                        {(selectedTest.requirements || []).map(
                                            (req: RequirementWithTest, index: number) => (
                                                <div
                                                    key={req.id || index}
                                                    className="flex items-center gap-2 rounded-lg border p-3"
                                                >
                                                    <input
                                                        className="flex-1 bg-transparent outline-none"
                                                        onChange={(e) => {
                                                            const updatedReqs = [...(selectedTest.requirements || [])]
                                                            updatedReqs[index] = {
                                                                ...req,
                                                                text: e.target.value
                                                            }
                                                            selectedTest.requirements = updatedReqs
                                                            setRequirementsContent(
                                                                updatedReqs
                                                                    .map((r: RequirementWithTest) => r.text)
                                                                    .join('\n')
                                                            )
                                                        }}
                                                        placeholder="Enter requirement..."
                                                        value={req.text || ''}
                                                    />
                                                    <Button
                                                        onClick={() => {
                                                            const updatedReqs = (
                                                                selectedTest.requirements || []
                                                            ).filter((_: any, i: number) => i !== index)
                                                            selectedTest.requirements = updatedReqs
                                                            setRequirementsContent(
                                                                updatedReqs.map((r: any) => r.text).join('\n')
                                                            )
                                                        }}
                                                        size="sm"
                                                        variant="ghost"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            )
                                        )}
                                        <Button
                                            onClick={() => {
                                                const newReq = {
                                                    id: `req-${Date.now()}`,
                                                    text: '',
                                                    description: null,
                                                    order: (selectedTest.requirements || []).length,
                                                    testSpecId: selectedTest.id,
                                                    createdAt: new Date(),
                                                    updatedAt: new Date()
                                                }
                                                const updatedReqs = [...(selectedTest.requirements || []), newReq]
                                                selectedTest.requirements = updatedReqs
                                                setRequirementsContent(updatedReqs.map((r: any) => r.text).join('\n'))
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
                                    {(selectedTest.requirements || []).map((req: any, index: number) => (
                                        <div
                                            className={cn(
                                                'flex items-start gap-3 rounded-lg border p-3',
                                                getRequirementStatusColor(req.status || 'pending')
                                            )}
                                            key={req.id || index}
                                        >
                                            <div className="mt-0.5">
                                                {getRequirementStatusIcon(req.status || 'pending')}
                                            </div>
                                            <div className="flex-1">
                                                <span className="font-medium text-sm">{req.text || req}</span>
                                                <div className="mt-1 text-muted-foreground text-xs">
                                                    Status:{' '}
                                                    <span className="capitalize">{req.status || 'pending'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {(selectedTest.requirements || []).length === 0 && (
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
                                <pre className="whitespace-pre-wrap">{selectedTest.code || 'No code available'}</pre>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </>
    )
}
