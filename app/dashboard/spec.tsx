'use client'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { MoreHorizontal, Edit, FileText, Trash2, Plus } from 'lucide-react'
import { SpecWithStats } from '@/lib/types'
import { STATUS_CONFIGS } from '@/lib/constants'
import { Badge } from '@/components/ui/badge'

interface SpecComponentProps {
    spec: SpecWithStats
    level?: number
    onSelect: (spec: SpecWithStats) => void
    onEdit: (spec: SpecWithStats) => void
    onDelete: (spec: SpecWithStats) => void
    onAddRequirement: (spec: SpecWithStats) => void
    selectedId: string | null
}

export function SpecComponent({
    spec,
    level = 0,
    onSelect,
    onEdit,
    onDelete,
    onAddRequirement,
    selectedId
}: SpecComponentProps) {
    const isSelected = selectedId === spec.id

    const handleClick = () => {
        onSelect(spec)
    }

    return (
        <div
            className={cn(
                'group flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1 hover:bg-muted/50',
                isSelected && 'bg-muted',
                level > 0 && 'ml-4'
            )}
        >
            <div className="flex flex-1 items-center gap-2" onClick={handleClick}>
                <div className="w-4" />

                <FileText className="h-4 w-4 text-muted-foreground" />

                <span className="flex-1 text-sm font-medium">{spec.name}</span>

                {spec.status && (
                    <div className="flex-shrink-0">
                        {(() => {
                            const config = STATUS_CONFIGS[spec.status as keyof typeof STATUS_CONFIGS]
                            return config.badgeClassName ?
                                    <Badge className={config.badgeClassName}>{config.label}</Badge>
                                :   null
                        })()}
                    </div>
                )}

                {spec.total > 0 && (
                    <div className="flex items-center gap-1 text-xs">
                        {spec.passed > 0 && <span className="text-emerald-600 font-medium">{spec.passed}</span>}
                        {spec.failed > 0 && <span className="text-red-600 font-medium">{spec.failed}</span>}
                        {spec.pending > 0 && <span className="text-amber-600 font-medium">{spec.pending}</span>}
                        {spec.skipped > 0 && <span className="text-slate-600 font-medium">{spec.skipped}</span>}
                        {spec.todo > 0 && <span className="text-orange-600 font-medium">{spec.todo}</span>}
                        <span className="text-muted-foreground">({spec.total})</span>
                    </div>
                )}
            </div>

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
                    <DropdownMenuItem onClick={() => onEdit(spec)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Spec
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onAddRequirement(spec)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Requirement
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600" onClick={() => onDelete(spec)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
