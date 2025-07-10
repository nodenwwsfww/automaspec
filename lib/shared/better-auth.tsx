import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from '@/db'
import * as schema from '@/db/schema'
import { createAuthClient } from 'better-auth/react'

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: 'sqlite',
        schema: schema
    }),
    trustedOrigins: [process.env.CORS_ORIGIN || ''],
    emailAndPassword: {
        enabled: true
    }
})

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_SITE_URL
})
