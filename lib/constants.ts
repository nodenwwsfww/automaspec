import { TestStatus, SpecStatus } from './types'
import { CheckCircle, XCircle, Clock } from 'lucide-react'

export const TEST_STATUSES: TestStatus[] = ['passed', 'failed', 'pending', 'skipped', 'todo']

export const SPEC_STATUSES: SpecStatus[] = ['skipped', 'todo']

export interface StatusConfig {
    icon: React.ElementType
    color: string
    label: string
}

export const STATUS_CONFIGS: Record<string, StatusConfig> = {
    passed: {
        icon: CheckCircle,
        color: 'text-green-600',
        label: 'Passed'
    },
    failed: {
        icon: XCircle,
        color: 'text-red-600',
        label: 'Failed'
    },
    pending: {
        icon: Clock,
        color: 'text-yellow-600',
        label: 'Pending'
    },
    skipped: {
        icon: Clock,
        color: 'text-slate-600',
        label: 'Skipped'
    },
    todo: {
        icon: Clock,
        color: 'text-orange-600',
        label: 'Todo'
    }
}

export function getStatusConfig(status: string): StatusConfig {
    return STATUS_CONFIGS[status] || STATUS_CONFIGS['pending']
}
