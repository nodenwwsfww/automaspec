import { TestStatus, SpecStatus } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, MinusCircle, Clock } from 'lucide-react'

function statusEnum(status: TestStatus | SpecStatus) {
    switch (status) {
        case 'passed':
            return {
                badge: <Badge className="border-emerald-200 bg-emerald-100 text-emerald-800">Passed</Badge>,
                color: 'text-emerald-600'
            }
        case 'failed':
            return {
                badge: <Badge className="border-red-200 bg-red-100 text-red-800">Failed</Badge>,
                color: 'text-red-600'
            }
        case 'skipped':
            return {
                badge: <Badge className="border-slate-200 bg-slate-100 text-slate-800">Skipped</Badge>,
                color: 'text-slate-600'
            }
        case 'todo':
            return {
                badge: <Badge className="border-orange-200 bg-orange-100 text-orange-800">Todo</Badge>,
                color: 'text-orange-600'
            }
        case 'pending':
            return {
                badge: <Badge className="border-amber-200 bg-amber-100 text-amber-800">Pending</Badge>,
                color: 'text-amber-600'
            }
        case 'default':
            return {
                badge: <Badge variant="secondary">Default</Badge>,
                color: 'text-gray-600'
            }
        default:
            return {
                badge: <Badge variant="secondary">Unknown</Badge>,
                color: 'text-gray-600'
            }
    }
}

function requirementEnum(status: TestStatus) {
    switch (status) {
        case 'passed':
            return {
                badge: (
                    <Badge className="text-emerald-800 bg-emerald-50">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Passed
                    </Badge>
                ),
                color: 'text-emerald-800 bg-emerald-50'
            }
        case 'failed':
            return {
                badge: (
                    <Badge className="text-red-800 bg-red-50">
                        <XCircle className="h-4 w-4 mr-1" />
                        Failed
                    </Badge>
                ),
                color: 'text-red-800 bg-red-50'
            }
        case 'skipped':
            return {
                badge: (
                    <Badge className="text-slate-700 bg-slate-50">
                        <MinusCircle className="h-4 w-4 mr-1" />
                        Skipped
                    </Badge>
                ),
                color: 'text-slate-700 bg-slate-50'
            }
        case 'todo':
            return {
                badge: (
                    <Badge className="text-orange-800 bg-orange-50">
                        <MinusCircle className="h-4 w-4 mr-1" />
                        Todo
                    </Badge>
                ),
                color: 'text-orange-800 bg-orange-50'
            }
        case 'pending':
            return {
                badge: (
                    <Badge className="text-amber-800 bg-amber-50">
                        <Clock className="h-4 w-4 mr-1" />
                        Pending
                    </Badge>
                ),
                color: 'text-amber-800 bg-amber-50'
            }
        default:
            return {
                badge: (
                    <Badge className="text-gray-600 bg-gray-50">
                        <MinusCircle className="h-4 w-4 mr-1" />
                        Unknown
                    </Badge>
                ),
                color: 'text-gray-600 bg-gray-50'
            }
    }
}

export { statusEnum, requirementEnum }
