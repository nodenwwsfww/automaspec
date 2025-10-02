import type { Session } from '@/lib/types'
import { ORPCError, os } from '@orpc/server'

export const authMiddleware = os.$context<{ session?: Session }>().middleware(async ({ context, next }) => {
    if (!context.session) {
        throw new ORPCError('Session not found')
    }

    return await next({
        context: { session: context.session }
    })
})

export const organizationMiddleware = os.$context<{ session?: Session }>().middleware(async ({ context, next }) => {
    if (!context.session?.session.activeOrganizationId) {
        throw new ORPCError('Organization not found')
    }

    // TODO: check if user requests from his organization or not

    return await next({
        context: { organizationId: context.session.session.activeOrganizationId }
    })
})
