import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { auth } from '@/lib/shared/better-auth'

export async function middleware(request: NextRequest) {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // Skip organization check for create-organization and invitations pages
    if (request.nextUrl.pathname === '/create-organization' || request.nextUrl.pathname === '/invitations') {
        return NextResponse.next()
    }

    // For now, just redirect to create organization if no active organization
    // The client-side logic will handle invitation checking
    if (!session.session.activeOrganizationId) {
        return NextResponse.redirect(new URL('/create-organization', request.url))
    }

    return NextResponse.next()
}

export const config = {
    runtime: 'nodejs',
    matcher: ['/dashboard', '/profile', '/settings']
}
