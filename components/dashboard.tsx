'use client'

import {
    AlertTriangle,
    Check,
    CheckCircle,
    ChevronDown,
    ChevronRight,
    Clock,
    Copy,
    Edit,
    FileText,
    Folder,
    Globe,
    Loader2,
    LogOut,
    MessageSquare,
    MinusCircle,
    MoreHorizontal,
    Plus,
    Settings,
    Trash2,
    User,
    XCircle
} from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { GroupEditorModal } from './group-editor-modal'
import { TestEditorModal } from './test-editor-modal'
import { client } from '@/lib/orpc'
import type {
    Test,
    TestGroup,
    TestCategory,
    TestRequirement,
    TestDataResponse,
    TreeNode,
    TestStatus,
    DisplayStatus,
    EditableNode,
    TestGroupWithType
} from '@/lib/types'

function getStatusColor(status: DisplayStatus) {
    switch (status) {
        case 'passed':
        case 'healthy':
            return 'text-green-600'
        case 'warning':
            return 'text-yellow-600'
        case 'failed':
            return 'text-red-600'
        default:
            return 'text-gray-600'
    }
}

function getStatusBadge(status: DisplayStatus) {
    switch (status) {
        case 'passed':
        case 'healthy':
            return <Badge className="border-green-200 bg-green-100 text-green-800">Healthy</Badge>
        case 'warning':
            return <Badge className="border-yellow-200 bg-yellow-100 text-yellow-800">Warning</Badge>
        case 'failed':
            return <Badge className="border-red-200 bg-red-100 text-red-800">Failed</Badge>
        default:
            return <Badge variant="secondary">Unknown</Badge>
    }
}

function getRequirementStatusIcon(status: DisplayStatus) {
    switch (status) {
        case 'passed':
            return <CheckCircle className="h-4 w-4 text-green-600" />
        case 'failed':
            return <XCircle className="h-4 w-4 text-red-600" />
        case 'skipped':
            return <MinusCircle className="h-4 w-4 text-gray-400" />
        case 'pending':
            return <Clock className="h-4 w-4 text-yellow-600" />
        default:
            return <MinusCircle className="h-4 w-4 text-gray-400" />
    }
}

function getRequirementStatusColor(status: DisplayStatus) {
    switch (status) {
        case 'passed':
            return 'text-green-800 bg-green-50'
        case 'failed':
            return 'text-red-800 bg-red-50'
        case 'skipped':
            return 'text-gray-600 bg-gray-50'
        case 'pending':
            return 'text-yellow-800 bg-yellow-50'
        default:
            return 'text-gray-600 bg-gray-50'
    }
}

interface TreeNodeProps {
    node: TreeNode
    level?: number
    onSelect: (node: TreeNode) => void
    selectedId: string | null
    onEdit: (node: TreeNode) => void
    onAddChild: (node: TreeNode) => void
    onDelete: (node: TreeNode) => void
}

function TreeNode({ node, level = 0, onSelect, selectedId, onEdit, onAddChild, onDelete }: TreeNodeProps) {
    const [isExpanded, setIsExpanded] = useState(level < 3)
    const hasChildren = (node.children?.length ?? 0) > 0
    const isLeaf = !hasChildren
    const isSelected = selectedId === node.id

    const percentage = node.total ? Math.round((node.passed / node.total) * 100) : 100
    const hasFailures = node.total && node.passed < node.total
    const failureCount = node.total ? node.total - node.passed : 0

    const IconComponent = node.icon || FileText

    const handleClick = () => {
        if (hasChildren) {
            setIsExpanded(!isExpanded)
        }
        // Only allow selecting test items (not groups)
        if (node.type === 'test') {
            onSelect(node)
        }
    }

    return (
        <div>
            <div
                className={cn(
                    'group flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1 hover:bg-muted/50',
                    isSelected && 'bg-muted',
                    level > 0 && 'ml-4'
                )}
            >
                <div className="flex flex-1 items-center gap-2" onClick={handleClick}>
                    {hasChildren && (
                        <div className="flex h-4 w-4 items-center justify-center">
                            {isExpanded ?
                                <ChevronDown className="h-3 w-3" />
                            :   <ChevronRight className="h-3 w-3" />}
                        </div>
                    )}
                    {!hasChildren && <div className="w-4" />}

                    <IconComponent className="h-4 w-4 text-muted-foreground" />

                    <span className={cn('flex-1 text-sm', isLeaf && 'font-medium')}>{node.name}</span>

                    {hasFailures && (
                        <div className="flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3 text-orange-500" />
                            <span className="text-orange-500 text-xs">{failureCount}</span>
                        </div>
                    )}

                    {node.total && (
                        <div className="flex items-center gap-2 text-muted-foreground text-xs">
                            <span>
                                {node.passed} / {node.total}
                            </span>
                            <span className={cn('font-medium', getStatusColor(node.status))}>{percentage}%</span>
                        </div>
                    )}
                </div>

                {/* Actions Menu */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            className="h-6 w-6 p-0 opacity-0 transition-opacity group-hover:opacity-100"
                            size="sm"
                            variant="ghost"
                        >
                            <MoreHorizontal className="h-3 w-3" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(node)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                        </DropdownMenuItem>
                        {node.type === 'group' && (
                            <>
                                <DropdownMenuItem onClick={() => onAddChild({ ...node, type: 'group' })}>
                                    <Folder className="mr-2 h-4 w-4" />
                                    Add Group
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => onAddChild({ ...node, type: 'test' })}>
                                    <FileText className="mr-2 h-4 w-4" />
                                    Add Test
                                </DropdownMenuItem>
                            </>
                        )}
                        <DropdownMenuItem className="text-red-600" onClick={() => onDelete(node)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {hasChildren && isExpanded && (
                <div>
                    {node.children?.map((child: TreeNode) => (
                        <TreeNode
                            key={child.id}
                            level={level + 1}
                            node={child}
                            onAddChild={onAddChild}
                            onDelete={onDelete}
                            onEdit={onEdit}
                            onSelect={onSelect}
                            selectedId={selectedId}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export function Dashboard() {
    const [selectedTest, setSelectedTest] = useState<Test | null>(null)
    const [groupEditorOpen, setGroupEditorOpen] = useState(false)
    const [testEditorOpen, setTestEditorOpen] = useState(false)
    const [testData, setTestData] = useState<TestDataResponse>({
        categories: [],
        groups: [],
        tests: [],
        requirements: []
    })
    const [editingGroup, setEditingGroup] = useState<TestGroup | null>(null)
    const [editingTest, setEditingTest] = useState<Test | null>(null)
    const [parentGroup, setParentGroup] = useState<TestGroup | null>(null)
    const [copied, setCopied] = useState(false)
    const [editingRequirements, setEditingRequirements] = useState(false)
    const [requirementsContent, setRequirementsContent] = useState('')
    const [loading, setLoading] = useState(true)

    // Helper function to fetch test data using orpc client
    const fetchTestData = async (): Promise<TestDataResponse> => {
        try {
            const [categories, groups, tests] = await Promise.all([
                client.testCategories.list({}),
                client.testGroups.list({}),
                client.tests.list({})
            ])

            return {
                categories,
                groups,
                tests,
                requirements: [] // TODO: Add requirements endpoint
            }
        } catch (error) {
            console.error('Error fetching test data:', error)
            return { categories: [], groups: [], tests: [], requirements: [] }
        }
    }

    // Load test data on component mount
    useEffect(() => {
        const loadData = async () => {
            setLoading(true)
            const data = await fetchTestData()
            setTestData(data)
            setLoading(false)
        }

        loadData()
    }, [])

    const handleTestSelect = (test: any) => {
        setSelectedTest(test)
        setRequirementsContent(test.requirements?.map((req: any) => req.text || req).join('\n') || '')
    }

    const handleEditGroup = (group: any) => {
        setEditingGroup(group)
        setParentGroup(null)
        setGroupEditorOpen(true)
    }

    const handleAddChild = (parentGroup: any) => {
        setEditingGroup({ type: parentGroup.type })
        setParentGroup(parentGroup)
        setGroupEditorOpen(true)
    }

    const handleEditTest = (test: any) => {
        setEditingTest(test)
        setTestEditorOpen(true)
    }

    const handleDeleteGroup = async (group: any) => {
        try {
            await fetch(`/rpc/test-groups/${group.id}`, {
                method: 'DELETE'
            })
            setTestData(await fetchTestData())
        } catch (error) {
            console.error('Failed to delete group:', error)
        }
    }

    const handleDeleteCategory = async (category: any) => {
        try {
            await fetch(`/rpc/test-categories/${category.id}`, {
                method: 'DELETE'
            })
            setTestData(await fetchTestData())
        } catch (error) {
            console.error('Failed to delete category:', error)
        }
    }

    const handleDeleteTest = async (test: any) => {
        try {
            await fetch(`/rpc/tests/${test.id}`, {
                method: 'DELETE'
            })
            setTestData(await fetchTestData())
            if (selectedTest?.id === test.id) {
                setSelectedTest(null)
            }
        } catch (error) {
            console.error('Failed to delete test:', error)
        }
    }

    const handleDelete = async (node: any) => {
        if (node.type === 'category') {
            await handleDeleteCategory(node)
        } else if (node.type === 'group') {
            await handleDeleteGroup(node)
        } else if (node.type === 'test') {
            await handleDeleteTest(node)
        }
    }

    const handleSaveGroup = async (item: any) => {
        // For now, just refresh the data after save
        // In a real implementation, you'd make the API call here
        const data = await fetchTestData()
        setTestData(data)
        setEditingGroup(null)
        setParentGroup(null)
    }

    const handleSaveTest = (_test: any) => {}

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
                    status: 'pending'
                }))
        }
        setEditingRequirements(false)
    }

    // Build hierarchical structure from flat data for display
    const buildHierarchy = () => {
        const { categories, groups, tests, requirements } = testData

        // Helper function to calculate test stats
        const calculateStats = (children: any[]) => {
            let passed = 0
            let total = 0

            children.forEach((child: any) => {
                if (child.type === 'test') {
                    total += 1
                    if (child.status === 'passed') passed += 1
                } else if (child.children) {
                    const childStats = calculateStats(child.children)
                    passed += childStats.passed
                    total += childStats.total
                }
            })

            return { passed, total }
        }

        // Create a map of categories with their groups
        const categoriesWithGroups = categories.map((category: any) => {
            const categoryGroups = groups
                .filter((group: any) => group.testCategoriesId === category.id)
                .map((group: any) => {
                    const groupTests = tests
                        .filter((test: any) => test.testGroupId === group.id)
                        .map((test: any) => ({
                            ...test,
                            type: 'test',
                            icon: FileText,
                            name: test.title,
                            passed: test.status === 'passed' ? 1 : 0,
                            total: 1,
                            requirements: requirements
                                .filter((req: any) => req.testId === test.id)
                                .sort((a: any, b: any) => a.order - b.order)
                                .map((req: any) => ({
                                    id: req.id,
                                    text: req.text,
                                    status: req.status
                                })),
                            code: test.code || 'No code available'
                        }))

                    const groupStats = calculateStats(groupTests)
                    return {
                        ...group,
                        type: 'group',
                        icon: Folder,
                        name: group.title,
                        children: groupTests,
                        passed: groupStats.passed,
                        total: groupStats.total,
                        status:
                            groupStats.passed === groupStats.total ? 'passed'
                            : groupStats.passed > 0 ? 'warning'
                            : 'failed'
                    }
                })

            const categoryStats = calculateStats(categoryGroups)
            return {
                ...category,
                type: 'category',
                icon: Folder,
                name: category.title,
                children: categoryGroups,
                passed: categoryStats.passed,
                total: categoryStats.total,
                status:
                    categoryStats.passed === categoryStats.total ? 'healthy'
                    : categoryStats.passed > 0 ? 'warning'
                    : 'failed'
            }
        })

        return categoriesWithGroups
    }

    const allTests = buildHierarchy()

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
                <div className="flex items-center justify-between border-b p-4">
                    <div className="flex items-center gap-4">
                        <h1 className="font-semibold text-lg">Test Structure</h1>
                        <Badge variant="secondary">Free Plan</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            onClick={() => {
                                setEditingGroup({ type: 'group' })
                                setParentGroup(null)
                                setGroupEditorOpen(true)
                            }}
                            size="sm"
                            variant="outline"
                        >
                            <Folder className="mr-2 h-4 w-4" />
                            New Group
                        </Button>

                        <Button
                            onClick={() => {
                                setEditingGroup({ type: 'test' })
                                setParentGroup(null)
                                setGroupEditorOpen(true)
                            }}
                            size="sm"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            New Test
                        </Button>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button size="sm" variant="ghost">
                                    <User className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                    <User className="mr-2 h-4 w-4" />
                                    Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Settings className="mr-2 h-4 w-4" />
                                    Settings
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/">
                                        <LogOut className="mr-2 h-4 w-4" />
                                        Logout
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                <div className="flex-1 overflow-auto p-2">
                    {(allTests as any[]).map((node: any) => (
                        <TreeNode
                            key={node.id}
                            node={node}
                            onAddChild={handleAddChild}
                            onDelete={handleDelete}
                            onEdit={handleEditGroup}
                            onSelect={handleTestSelect}
                            selectedId={(selectedTest as any)?.id}
                        />
                    ))}
                </div>
            </div>

            {/* Right Panel - Test Details */}
            <div className="flex w-1/2 flex-col">
                {selectedTest ?
                    <>
                        <div className="border-b p-4">
                            <div className="mb-2 flex items-start justify-between">
                                <div>
                                    <div className="mb-1 flex items-center gap-2">
                                        <h2 className="font-semibold text-xl">{(selectedTest as any).name}</h2>
                                        <Button onClick={() => handleEditTest(selectedTest)} size="sm" variant="ghost">
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <p className="mb-2 text-muted-foreground text-sm">
                                        {(selectedTest as any).description}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline">{(selectedTest as any).framework}</Badge>
                                        {getStatusBadge((selectedTest as any).status)}
                                        <span className="text-muted-foreground text-sm">
                                            Coverage:{' '}
                                            <span
                                                className={cn(
                                                    'font-medium',
                                                    getStatusColor((selectedTest as any).status)
                                                )}
                                            >
                                                {(selectedTest as any).total ?
                                                    Math.round(
                                                        ((selectedTest as any).passed / (selectedTest as any).total) *
                                                            100
                                                    )
                                                :   0}
                                                %
                                            </span>{' '}
                                            {(selectedTest as any).passed} of {(selectedTest as any).total}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-auto p-4">
                            <Tabs className="h-full" defaultValue="requirements">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="requirements">Functional Requirements</TabsTrigger>
                                    <TabsTrigger value="playwright">Playwright Code</TabsTrigger>
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

                                        {((selectedTest as any).requirements || []).length > 0 && (
                                            <div className="mb-4 rounded-lg bg-muted/30 p-3">
                                                <div className="flex items-center gap-4 text-sm">
                                                    <div className="flex items-center gap-1">
                                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                                        <span className="font-medium">
                                                            {
                                                                ((selectedTest as any).requirements || []).filter(
                                                                    (req: any) => req.status === 'passed'
                                                                ).length
                                                            }{' '}
                                                            Passed
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <XCircle className="h-4 w-4 text-red-600" />
                                                        <span className="font-medium">
                                                            {
                                                                ((selectedTest as any).requirements || []).filter(
                                                                    (req: any) => req.status === 'failed'
                                                                ).length
                                                            }{' '}
                                                            Failed
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="h-4 w-4 text-yellow-600" />
                                                        <span className="font-medium">
                                                            {
                                                                ((selectedTest as any).requirements || []).filter(
                                                                    (req: any) => req.status === 'pending'
                                                                ).length
                                                            }{' '}
                                                            Pending
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {editingRequirements ?
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    {((selectedTest as any).requirements || []).map(
                                                        (req: any, index: number) => (
                                                            <div
                                                                key={req.id || index}
                                                                className="flex items-center gap-2 rounded-lg border p-3"
                                                            >
                                                                <input
                                                                    className="flex-1 bg-transparent outline-none"
                                                                    onChange={(e) => {
                                                                        const updatedReqs = [
                                                                            ...((selectedTest as any).requirements ||
                                                                                [])
                                                                        ]
                                                                        updatedReqs[index] = {
                                                                            ...req,
                                                                            text: e.target.value
                                                                        }
                                                                        ;(selectedTest as any).requirements =
                                                                            updatedReqs
                                                                        setRequirementsContent(
                                                                            updatedReqs
                                                                                .map((r: any) => r.text)
                                                                                .join('\n')
                                                                        )
                                                                    }}
                                                                    placeholder="Enter requirement..."
                                                                    value={req.text || ''}
                                                                />
                                                                <Button
                                                                    onClick={() => {
                                                                        const updatedReqs = (
                                                                            (selectedTest as any).requirements || []
                                                                        ).filter((_: any, i: number) => i !== index)
                                                                        ;(selectedTest as any).requirements =
                                                                            updatedReqs
                                                                        setRequirementsContent(
                                                                            updatedReqs
                                                                                .map((r: any) => r.text)
                                                                                .join('\n')
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
                                                                status: 'pending'
                                                            }
                                                            const updatedReqs = [
                                                                ...((selectedTest as any).requirements || []),
                                                                newReq
                                                            ]
                                                            ;(selectedTest as any).requirements = updatedReqs
                                                            setRequirementsContent(
                                                                updatedReqs.map((r: any) => r.text).join('\n')
                                                            )
                                                        }}
                                                        size="sm"
                                                        variant="outline"
                                                    >
                                                        <Plus className="mr-2 h-4 w-4" />
                                                        Add Requirement
                                                    </Button>
                                                </div>
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        onClick={() => setEditingRequirements(false)}
                                                        variant="outline"
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button onClick={saveRequirements}>Save Requirements</Button>
                                                </div>
                                            </div>
                                        :   <div className="space-y-2">
                                                {((selectedTest as any).requirements || []).map(
                                                    (req: any, index: number) => (
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
                                                                <span className="font-medium text-sm">
                                                                    {req.text || req}
                                                                </span>
                                                                <div className="mt-1 text-muted-foreground text-xs">
                                                                    Status:{' '}
                                                                    <span className="capitalize">
                                                                        {req.status || 'pending'}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                )}
                                                {((selectedTest as any).requirements || []).length === 0 && (
                                                    <div className="text-muted-foreground text-sm">
                                                        No requirements defined
                                                    </div>
                                                )}
                                            </div>
                                        }
                                    </div>
                                </TabsContent>

                                <TabsContent className="mt-4" value="playwright">
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
                                            <pre className="whitespace-pre-wrap">{(selectedTest as any).code}</pre>
                                        </div>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </>
                :   <div className="flex flex-1 items-center justify-center text-muted-foreground">
                        <div className="text-center">
                            <FileText className="mx-auto mb-4 h-12 w-12 opacity-50" />
                            <p>Select a test to view details and code</p>
                            <div className="mt-4 flex gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setEditingGroup({ type: 'group' })
                                        setParentGroup(null)
                                        setGroupEditorOpen(true)
                                    }}
                                >
                                    <Folder className="mr-2 h-4 w-4" />
                                    Create Group
                                </Button>
                                <Button
                                    onClick={() => {
                                        setEditingGroup({ type: 'test' })
                                        setParentGroup(null)
                                        setGroupEditorOpen(true)
                                    }}
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create Test
                                </Button>
                            </div>
                        </div>
                    </div>
                }
            </div>

            {/* Modals */}
            <GroupEditorModal
                group={editingGroup}
                onOpenChange={setGroupEditorOpen}
                onSave={handleSaveGroup}
                open={groupEditorOpen}
                parentGroup={parentGroup}
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
