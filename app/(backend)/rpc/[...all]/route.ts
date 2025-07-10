import { OpenAPIHandler } from '@orpc/openapi/fetch'
import { CORSPlugin } from '@orpc/server/plugins'
import { onError } from '@orpc/server'
import { testsRouter } from '@/contracts/tests'
import { experimental_ZodSmartCoercionPlugin as ZodSmartCoercionPlugin } from '@orpc/zod/zod4'

const combinedRouter = testsRouter

const handler = new OpenAPIHandler(combinedRouter, {
    plugins: [
        new CORSPlugin({
            exposeHeaders: ['Content-Disposition']
        }),
        new ZodSmartCoercionPlugin()
    ],
    interceptors: [onError((error) => console.error(error))]
})

async function handleRequest(request: Request) {
    const { response } = await handler.handle(request, {
        prefix: '/rpc',
        context: {} // Provide initial context if needed
    })

    return response ?? new Response('Not found', { status: 404 })
}

export const HEAD = handleRequest
export const GET = handleRequest
export const POST = handleRequest
export const PUT = handleRequest
export const PATCH = handleRequest
export const DELETE = handleRequest
