import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from '@/db'
import * as schema from '@/db/schema'
import { createAuthClient } from 'better-auth/react'
import { organization } from 'better-auth/plugins/organization'
import { organizationClient, inferOrgAdditionalFields } from 'better-auth/client/plugins'

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: 'sqlite',
        schema: schema
    }),
    trustedOrigins: [...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : [])],
    emailAndPassword: {
        enabled: true
    },
    plugins: [
        organization({
            allowUserToCreateOrganization: true,
            organizationLimit: 1,
            membershipLimit: 1,
            creatorRole: 'owner'
        })
    ]
})

export const authClient = createAuthClient({
    baseURL: typeof window !== 'undefined' ? window.location.origin : undefined,
    plugins: [
        organizationClient({
            schema: inferOrgAdditionalFields<typeof auth>()
        })
    ]
})

export type AuthClient = typeof authClient
