
import { auth } from '@/lib/shared/better-auth'

export async function createContext(req: Request) {
    const session = await auth.api.getSession({
        headers: req.headers
    })
    return {
        session
    }
}

export type Context = Awaited<ReturnType<typeof createContext>>
