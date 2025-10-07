import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

// Cleanup after each test
afterEach(() => {
    cleanup()
})

// Mock Next.js router
vi.mock('next/navigation', () => ({
    useRouter() {
        return {
            push: vi.fn(),
            replace: vi.fn(),
            prefetch: vi.fn(),
            back: vi.fn(),
            pathname: '/',
            query: {},
            asPath: '/'
        }
    },
    usePathname() {
        return '/'
    },
    useSearchParams() {
        return new URLSearchParams()
    }
}))

// Mock better-auth
vi.mock('@/lib/shared/better-auth', () => ({
    authClient: {
        useSession: vi.fn(() => ({
            data: null,
            isPending: false,
            error: null
        }))
    }
}))

// Extend Vitest matchers
import { expect } from 'vitest'
import * as matchers from '@testing-library/jest-dom/matchers'

expect.extend(matchers)
