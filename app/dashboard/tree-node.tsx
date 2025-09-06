'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { ChevronDown, ChevronRight, FileText, MoreHorizontal, Edit, Folder, Trash2 } from 'lucide-react'
import { TreeNode } from '@/lib/types'
import { SPEC_STATUSES, STATUS_CONFIGS } from '@/lib/constants'
import { Badge } from '@/components/ui/badge'

interface TreeNodeProps {
    node: TreeNode
    level?: number
    onSelect: (node: TreeNode) => void
    selectedId: string | null
    onEdit: (node: TreeNode) => void
    onAddChild: (node: TreeNode) => void
    onDelete: (node: TreeNode) => void
}

export function TreeNodeComponent({
    node,
    level = 0,
    onSelect,
    selectedId,
    onEdit,
    onAddChild,
    onDelete
}: TreeNodeProps) {
    const [isExpanded, setIsExpanded] = useState(level < 3)
    const hasChildren = (node.children?.length ?? 0) > 0
    const isLeaf = !hasChildren
    const isSelected = selectedId === node.id

    const IconComponent = node.icon || FileText

    const handleClick = () => {
        if (hasChildren) {
            setIsExpanded(!isExpanded)
        }
        // Allow selecting specs
        if (node.type === 'spec') {
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

                    {node.type === 'spec' && node.status && (
                        <div className="flex-shrink-0">
                            {(() => {
                                const config = STATUS_CONFIGS[node.status]
                                return config.badgeClassName ?
                                        <Badge className={config.badgeClassName}>{config.label}</Badge>
                                    :   null
                            })()}
                        </div>
                    )}

                    {node.total && node.type !== 'category' && (
                        <div className="flex items-center gap-1 text-xs">
                            {node.passed !== undefined && node.passed > 0 && (
                                <span className="text-emerald-600 font-medium">{node.passed}</span>
                            )}
                            {node.failed !== undefined && node.failed > 0 && (
                                <span className="text-red-600 font-medium">{node.failed}</span>
                            )}
                            {node.pending !== undefined && node.pending > 0 && (
                                <span className="text-amber-600 font-medium">{node.pending}</span>
                            )}
                            {node.skipped !== undefined && node.skipped > 0 && (
                                <span className="text-slate-600 font-medium">{node.skipped}</span>
                            )}
                            {node.todo !== undefined && node.todo > 0 && (
                                <span className="text-orange-600 font-medium">{node.todo}</span>
                            )}
                            <span className="text-muted-foreground">({node.total})</span>
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
                        {node.type === 'spec' && (
                            <>
                                <DropdownMenuItem onClick={() => onAddChild({ ...node, type: 'spec' })}>
                                    <Folder className="mr-2 h-4 w-4" />
                                    Add Spec
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => onAddChild({ ...node, type: 'spec', status: SPEC_STATUSES.missing })}
                                >
                                    <FileText className="mr-2 h-4 w-4" />
                                    Add Requirement
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
                        <TreeNodeComponent
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
