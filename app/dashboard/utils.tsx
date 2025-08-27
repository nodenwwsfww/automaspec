import { TestStatus, SpecStatus } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, MinusCircle, Clock } from 'lucide-react'

function getStatusColor(status: TestStatus | SpecStatus) {
    switch (status) {
        case 'passed':
            return 'text-emerald-600'
        case 'failed':
            return 'text-red-600'
        case 'skipped':
            return 'text-slate-600'
        case 'todo':
            return 'text-orange-600'
        case 'pending':
            return 'text-amber-600'
        case 'default':
            return 'text-gray-600'
        default:
            return 'text-gray-600'
    }
}

function getStatusBadge(status: TestStatus | SpecStatus) {
    switch (status) {
        case 'passed':
            return <Badge className="border-emerald-200 bg-emerald-100 text-emerald-800">Passed</Badge>
        case 'failed':
            return <Badge className="border-red-200 bg-red-100 text-red-800">Failed</Badge>
        case 'skipped':
            return <Badge className="border-slate-200 bg-slate-100 text-slate-800">Skipped</Badge>
        case 'todo':
            return <Badge className="border-orange-200 bg-orange-100 text-orange-800">Todo</Badge>
        case 'pending':
            return <Badge className="border-amber-200 bg-amber-100 text-amber-800">Pending</Badge>
        case 'default':
            return <Badge variant="secondary">Default</Badge>
        default:
            return <Badge variant="secondary">Unknown</Badge>
    }
}

function getRequirementStatusIcon(status: TestStatus) {
    switch (status) {
        case 'passed':
            return <CheckCircle className="h-4 w-4 text-emerald-600" />
        case 'failed':
            return <XCircle className="h-4 w-4 text-red-600" />
        case 'skipped':
            return <MinusCircle className="h-4 w-4 text-slate-500" />
        case 'todo':
            return <MinusCircle className="h-4 w-4 text-orange-500" />
        case 'pending':
            return <Clock className="h-4 w-4 text-amber-600" />
        default:
            return <MinusCircle className="h-4 w-4 text-gray-400" />
    }
}

function getRequirementStatusColor(status: TestStatus) {
    switch (status) {
        case 'passed':
            return 'text-emerald-800 bg-emerald-50'
        case 'failed':
            return 'text-red-800 bg-red-50'
        case 'skipped':
            return 'text-slate-700 bg-slate-50'
        case 'todo':
            return 'text-orange-800 bg-orange-50'
        case 'pending':
            return 'text-amber-800 bg-amber-50'
        default:
            return 'text-gray-600 bg-gray-50'
    }
}
export { getStatusColor, getStatusBadge, getRequirementStatusIcon, getRequirementStatusColor }
