'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { ChevronDown, ChevronRight, MoreHorizontal, Edit, Folder, Trash2, Plus } from 'lucide-react'
import { CategoryWithStats } from '@/lib/types'

interface CategoryComponentProps {
    category: CategoryWithStats
    level?: number
    onEdit: (category: CategoryWithStats) => void
    onAddChild: (category: CategoryWithStats) => void
    onDelete: (category: CategoryWithStats) => void
    onAddSpec: (category: CategoryWithStats) => void
    children?: React.ReactNode
}

export function CategoryComponent({
    category,
    level = 0,
    onEdit,
    onAddChild,
    onDelete,
    onAddSpec,
    children
}: CategoryComponentProps) {
    const [isExpanded, setIsExpanded] = useState(level < 3)
    const hasChildren = category.children.length > 0 || category.specs.length > 0

    const handleClick = () => {
        if (hasChildren) {
            setIsExpanded(!isExpanded)
        }
    }

    return (
        <div>
            <div
                className={cn(
                    'group flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1 hover:bg-muted/50',
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

                    <Folder className="h-4 w-4 text-muted-foreground" />

                    <span className="flex-1 text-sm font-medium">{category.name}</span>

                    {category.total > 0 && (
                        <div className="flex items-center gap-1 text-xs">
                            {category.passed > 0 && (
                                <span className="text-emerald-600 font-medium">{category.passed}</span>
                            )}
                            {category.failed > 0 && <span className="text-red-600 font-medium">{category.failed}</span>}
                            {category.pending > 0 && (
                                <span className="text-amber-600 font-medium">{category.pending}</span>
                            )}
                            {category.skipped > 0 && (
                                <span className="text-slate-600 font-medium">{category.skipped}</span>
                            )}
                            {category.todo > 0 && <span className="text-orange-600 font-medium">{category.todo}</span>}
                            <span className="text-muted-foreground">({category.total})</span>
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
                        <DropdownMenuItem onClick={() => onEdit(category)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Category
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onAddChild(category)}>
                            <Folder className="mr-2 h-4 w-4" />
                            Add Subcategory
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onAddSpec(category)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Spec
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={() => onDelete(category)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {hasChildren && isExpanded && <div>{children}</div>}
        </div>
    )
}
