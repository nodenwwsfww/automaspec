import type { Session } from '@/lib/types'
import { os } from '@orpc/server'

export const authMiddleware = os.$context<{ session?: Session }>().middleware(async ({ context, next }) => {
    if (!context.session) {
        throw new Error('Session not found')
    }

    return await next({
        context: {
            session: context.session
        }
    })
})
