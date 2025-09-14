'use client'

import { useMemo } from 'react'
import { selectionFeature, syncDataLoaderFeature, hotkeysCoreFeature } from '@headless-tree/core'
import { useTree } from '@headless-tree/react'
import { ChevronDown, ChevronRight, FileText, Folder } from 'lucide-react'
import { cn } from '@/lib/utils'
import { STATUS_CONFIGS } from '@/lib/constants'
import { Badge } from '@/components/ui/badge'
import type {
    CategoryWithStats,
    SpecWithStats,
    TestCategory,
    TestSpec,
    TestRequirement,
    Test,
    TestStatus
} from '@/lib/types'
import { TEST_STATUSES } from '@/lib/constants'

interface ItemPayload {
    type: 'category' | 'spec'
    category?: CategoryWithStats
    spec?: SpecWithStats
}

interface TreeProps {
    categories: TestCategory[]
    specs: TestSpec[]
    requirements: TestRequirement[]
    tests: Test[]
    selectedSpecId: TestSpec['id'] | null
    onSelectSpec: (spec: SpecWithStats) => void
}

export function Tree({ categories, specs, requirements, tests, selectedSpecId, onSelectSpec }: TreeProps) {
    const calculateSpecStats = (spec: TestSpec): SpecWithStats => {
        const specRequirements = requirements.filter((req) => req.testSpecId === spec.id)
        let passed = 0
        let failed = 0
        let pending = 0
        let skipped = 0
        let todo = 0
        const total = specRequirements.length

        specRequirements.forEach((requirement) => {
            const test = tests.find((t) => t.testRequirementId === requirement.id)
            if (test?.status === TEST_STATUSES.passed) passed += 1
            else if (test?.status === TEST_STATUSES.failed) failed += 1
            else if (test?.status === TEST_STATUSES.pending) pending += 1
            else if (test?.status === TEST_STATUSES.skipped) skipped += 1
            else if (test?.status === TEST_STATUSES.todo) todo += 1
        })

        return {
            ...spec,
            passed,
            failed,
            pending,
            skipped,
            todo,
            total
        }
    }

    const buildHierarchy = useMemo(() => {
        const specsWithStats = specs.map(calculateSpecStats)

        const calculateCategoryStats = (s: SpecWithStats[], children: CategoryWithStats[]) => {
            let passed = 0
            let failed = 0
            let pending = 0
            let skipped = 0
            let todo = 0
            let total = 0
            s.forEach((spec) => {
                passed += spec.passed
                failed += spec.failed
                pending += spec.pending
                skipped += spec.skipped
                todo += spec.todo
                total += spec.total
            })
            children.forEach((child) => {
                passed += child.passed
                failed += child.failed
                pending += child.pending
                skipped += child.skipped
                todo += child.todo
                total += child.total
            })
            return { passed, failed, pending, skipped, todo, total }
        }

        const buildCategory = (category: TestCategory): CategoryWithStats => {
            const childCategories = categories
                .filter((cat) => cat.parentCategoryId === category.id)
                .map((child) => buildCategory(child))
            const categorySpecs = specsWithStats.filter((spec) => spec.testCategoryId === category.id)
            const stats = calculateCategoryStats(categorySpecs, childCategories)
            const status: TestStatus =
                stats.passed === stats.total ? TEST_STATUSES.passed
                : stats.passed > 0 ? TEST_STATUSES.pending
                : TEST_STATUSES.failed
            return {
                ...category,
                children: childCategories,
                specs: categorySpecs,
                ...stats,
                status
            }
        }

        const roots: CategoryWithStats[] = categories.filter((c) => !c.parentCategoryId).map(buildCategory)
        const orphanSpecs: SpecWithStats[] = specs.filter((s) => !s.testCategoryId).map(calculateSpecStats)
        return { roots, orphanSpecs }
    }, [categories, specs, requirements, tests])

    const { itemsById, childrenById } = useMemo(() => {
        const items: Record<string, ItemPayload> = {}
        const children: Record<string, string[]> = { root: [] }

        const makeCatId = (id: string) => `cat:${id}`
        const makeSpecId = (id: string) => `spec:${id}`

        const ensure = (id: string) => {
            if (!children[id]) children[id] = []
        }

        // Orphan specs (without category) go under root
        buildHierarchy.orphanSpecs.forEach((spec) => {
            const sid = makeSpecId(spec.id)
            items[sid] = { type: 'spec', spec }
            children.root.push(sid)
        })

        const addCategory = (cat: CategoryWithStats, parent: string | null) => {
            const cid = makeCatId(cat.id)
            items[cid] = { type: 'category', category: cat }
            ensure(cid)
            if (parent) {
                ensure(parent)
                children[parent].push(cid)
            } else {
                children.root.push(cid)
            }

            // specs of this category
            cat.specs.forEach((spec) => {
                const sid = makeSpecId(spec.id)
                items[sid] = { type: 'spec', spec }
                children[cid].push(sid)
            })

            // child categories
            cat.children.forEach((child) => addCategory(child, cid))
        }

        buildHierarchy.roots.forEach((r) => addCategory(r, null))

        return { itemsById: items, childrenById: children }
    }, [buildHierarchy])

    const tree = useTree<ItemPayload>({
        rootItemId: 'root',
        getItemName: (item) => item.getItemData().category?.name || item.getItemData().spec?.name || '',
        isItemFolder: (item) => item.getItemData().type === 'category',
        dataLoader: {
            getItem: (itemId) => itemsById[itemId],
            getChildren: (itemId) => childrenById[itemId]
        },
        indent: 16,
        features: [syncDataLoaderFeature, selectionFeature, hotkeysCoreFeature]
    })

    return (
        <div {...tree.getContainerProps()} className="flex flex-col">
            {tree.getItems().map((item) => {
                const payload = item.getItemData()
                const level = item.getItemMeta().level
                const isFolder = item.isFolder()
                const isExpanded = item.isExpanded()
                const isSelected = payload.spec ? selectedSpecId === payload.spec.id : false

                const baseProps = item.getProps()
                const onClick = (e: any) => {
                    baseProps.onClick?.(e)
                    if (payload.spec) onSelectSpec(payload.spec)
                }

                return (
                    <button
                        {...baseProps}
                        onClick={onClick}
                        key={item.getId()}
                        className={cn(
                            'group flex w-full cursor-pointer items-center gap-2 rounded-sm px-2 py-1 hover:bg-muted/50',
                            isSelected && 'bg-muted'
                        )}
                        style={{ paddingLeft: `${level * 16}px` }}
                    >
                        {/* Chevron */}
                        <div className="flex h-4 w-4 items-center justify-center">
                            {isFolder ?
                                isExpanded ?
                                    <ChevronDown className="h-3 w-3" />
                                :   <ChevronRight className="h-3 w-3" />
                            :   <span className="w-3" />}
                        </div>

                        {/* Icon */}
                        {isFolder ?
                            <Folder className="h-4 w-4 text-muted-foreground" />
                        :   <FileText className="h-4 w-4 text-muted-foreground" />}

                        {/* Label */}
                        <span className="flex-1 text-left text-sm font-medium">{item.getItemName()}</span>

                        {/* Right side stats/badge for specs */}
                        {payload.spec && (
                            <div className="flex items-center gap-2">
                                {payload.spec.status &&
                                    (() => {
                                        const config =
                                            STATUS_CONFIGS[payload.spec.status as keyof typeof STATUS_CONFIGS]
                                        return config?.badgeClassName ?
                                                <Badge className={config.badgeClassName}>{config.label}</Badge>
                                            :   null
                                    })()}
                                {payload.spec.total > 0 && (
                                    <div className="flex items-center gap-1 text-xs">
                                        {payload.spec.passed > 0 && (
                                            <span className="text-emerald-600 font-medium">{payload.spec.passed}</span>
                                        )}
                                        {payload.spec.failed > 0 && (
                                            <span className="text-red-600 font-medium">{payload.spec.failed}</span>
                                        )}
                                        {payload.spec.pending > 0 && (
                                            <span className="text-amber-600 font-medium">{payload.spec.pending}</span>
                                        )}
                                        {payload.spec.skipped > 0 && (
                                            <span className="text-slate-600 font-medium">{payload.spec.skipped}</span>
                                        )}
                                        {payload.spec.todo > 0 && (
                                            <span className="text-orange-600 font-medium">{payload.spec.todo}</span>
                                        )}
                                        <span className="text-muted-foreground">({payload.spec.total})</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </button>
                )
            })}
        </div>
    )
}
