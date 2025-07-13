import { OpenAPILink } from '@orpc/openapi-client/fetch'
import type { JsonifiedClient } from '@orpc/openapi-client'
import { testsContract } from '@/contracts/tests'
import { createORPCClient } from '@orpc/client'
import type { ContractRouterClient } from '@orpc/contract'
import { createTanstackQueryUtils } from '@orpc/tanstack-query'

declare global {
    var $client: JsonifiedClient<ContractRouterClient<typeof testsContract>> | undefined
}

const link = new OpenAPILink(testsContract, {
    url: () => {
        if (typeof window === 'undefined') {
            throw new Error('OpenAPILink is not allowed on the server side.')
        }

        return `${window.location.origin}/rpc`
    },
    headers: async () => {
        if (typeof window !== 'undefined') {
            return {}
        }

        const { headers } = await import('next/headers')
        return Object.fromEntries(await headers())
    },
    fetch: (request, init) =>
        globalThis.fetch(request, {
            ...init,
            credentials: 'include'
            // TODO: check if this is needed in nextjs
        })
})

/**
 * Fallback to client-side client if server-side client is not available.
 */
export const client: JsonifiedClient<ContractRouterClient<typeof testsContract>> =
    globalThis.$client ?? createORPCClient(link)

export const orpc = createTanstackQueryUtils(client)
