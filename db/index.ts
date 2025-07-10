import { drizzle } from 'drizzle-orm/libsql/web'

// FIXME: This is a hack to get the database working in the browser.
// We need to find a better way to do this.
export const db = () =>
    drizzle({
        connection: {
            url: process.env.DATABASE_URL || '',
            authToken: process.env.DATABASE_AUTH_TOKEN
        }
    })
