import { CheckCircle, XCircle, Clock, MinusCircle, type LucideIcon } from 'lucide-react'
import type { JsonAssertionResult } from 'vitest/reporters' // https://github.com/vitest-dev/vitest/blob/main/packages/vitest/src/node/reporters/json.ts
import type { TestStatus, SpecStatus } from './types'

export const SPEC_STATUSES = {
    active: 'active',
    skipped: 'skipped',
    todo: 'todo'
} as const

export const TEST_STATUSES = {
    passed: 'passed',
    skipped: 'skipped',
    todo: 'todo',
    failed: 'failed',
    pending: 'pending'
} satisfies Record<string, JsonAssertionResult['status']>

export type StatusConfig = {
    icon: LucideIcon
    color: string
    label: string
    badgeClassName: string
    requirementClassName: string
}

export const STATUS_CONFIGS: Record<TestStatus | SpecStatus, StatusConfig> = {
    [SPEC_STATUSES.active]: {
        icon: CheckCircle,
        color: 'text-emerald-600',
        label: 'Active',
        badgeClassName: 'border-emerald-200 bg-emerald-100 text-emerald-800',
        requirementClassName: 'text-emerald-800 bg-emerald-50'
    },
    [TEST_STATUSES.passed]: {
        icon: CheckCircle,
        color: 'text-emerald-600',
        label: 'Passed',
        badgeClassName: 'border-emerald-200 bg-emerald-100 text-emerald-800',
        requirementClassName: 'text-emerald-800 bg-emerald-50'
    },
    [TEST_STATUSES.failed]: {
        icon: XCircle,
        color: 'text-red-600',
        label: 'Failed',
        badgeClassName: 'border-red-200 bg-red-100 text-red-800',
        requirementClassName: 'text-red-800 bg-red-50'
    },
    [TEST_STATUSES.pending]: {
        icon: Clock,
        color: 'text-amber-600',
        label: 'Pending',
        badgeClassName: 'border-amber-200 bg-amber-100 text-amber-800',
        requirementClassName: 'text-amber-800 bg-amber-50'
    },
    [TEST_STATUSES.skipped]: {
        icon: MinusCircle,
        color: 'text-slate-600',
        label: 'Skipped',
        badgeClassName: 'border-slate-200 bg-slate-100 text-slate-800',
        requirementClassName: 'text-slate-700 bg-slate-50'
    },
    [TEST_STATUSES.todo]: {
        icon: MinusCircle,
        color: 'text-orange-600',
        label: 'Todo',
        badgeClassName: 'border-orange-200 bg-orange-100 text-orange-800',
        requirementClassName: 'text-orange-800 bg-orange-50'
    }
} as const

// export function getStatusConfig(status: TestStatus): StatusConfig {
//     return STATUS_CONFIGS[status]
// }
