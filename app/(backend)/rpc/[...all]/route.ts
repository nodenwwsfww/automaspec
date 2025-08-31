import { OpenAPIHandler } from '@orpc/openapi/fetch'
import { CORSPlugin } from '@orpc/server/plugins'
import { onError } from '@orpc/server'
import { router } from '@/orpc/routes'
import { ZodToJsonSchemaConverter } from '@orpc/zod/zod4'
import { experimental_SmartCoercionPlugin as SmartCoercionPlugin } from '@orpc/json-schema'
import { auth } from '@/lib/shared/better-auth'

const handler = new OpenAPIHandler(router, {
    plugins: [
        new CORSPlugin({
            exposeHeaders: ['Content-Disposition']
        }),
        new SmartCoercionPlugin({
            schemaConverters: [new ZodToJsonSchemaConverter()]
        })
    ],
    interceptors: [onError((error) => console.error(error))]
})

async function handleRequest(request: Request) {
    const session = await auth.api.getSession({
        headers: request.headers
    })

    const { response } = await handler.handle(request, {
        prefix: '/rpc',
        context: { session }
    })

    return response ?? new Response('Not found', { status: 404 })
}

export const HEAD = handleRequest
export const GET = handleRequest
export const POST = handleRequest
export const PUT = handleRequest
export const PATCH = handleRequest
export const DELETE = handleRequest
