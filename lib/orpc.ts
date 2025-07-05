import { OpenAPILink } from '@orpc/openapi-client/fetch'
import type { JsonifiedClient } from '@orpc/openapi-client'
import { exampleContract } from '@/contracts/example'
import { createORPCClient } from '@orpc/client'
import type { ContractRouterClient } from '@orpc/contract'

declare global {
    var $client: JsonifiedClient<ContractRouterClient<typeof exampleContract>> | undefined
}

const link = new OpenAPILink(exampleContract, {
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
  fetch: (request, init) => // Override fetch if needed
  globalThis.fetch(request, {
    ...init,
    credentials: 'include', // Include cookies for cross-origin requests
    // TODO: check if this is needed in nextjs
  }),
})

/**
 * Fallback to client-side client if server-side client is not available.
 */
export const client: JsonifiedClient<ContractRouterClient<typeof exampleContract>> = globalThis.$client ?? createORPCClient(link)
