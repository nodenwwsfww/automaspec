import { TestStatus } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, MinusCircle, Clock } from 'lucide-react'

function getStatusColor(status: TestStatus) {
    switch (status) {
        case 'passed':
            return 'text-green-600'
        case 'warning':
            return 'text-yellow-600'
        case 'failed':
            return 'text-red-600'
        default:
            return 'text-gray-600'
    }
}

function getStatusBadge(status: TestStatus) {
    switch (status) {
        case 'passed':
            return <Badge className="border-green-200 bg-green-100 text-green-800">Healthy</Badge>
        case 'warning':
            return <Badge className="border-yellow-200 bg-yellow-100 text-yellow-800">Warning</Badge>
        case 'failed':
            return <Badge className="border-red-200 bg-red-100 text-red-800">Failed</Badge>
        default:
            return <Badge variant="secondary">Unknown</Badge>
    }
}

function getRequirementStatusIcon(status: TestStatus) {
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

function getRequirementStatusColor(status: TestStatus) {
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
export { getStatusColor, getStatusBadge, getRequirementStatusIcon, getRequirementStatusColor }
