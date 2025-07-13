import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    experimental: {
        // @ts-expect-error - This is a valid experimental feature
        browserDebugInfoInTerminal: true
    },
    eslint: {
        ignoreDuringBuilds: true
    },
    typescript: {
        ignoreBuildErrors: true
    },
    images: {
        unoptimized: true
    }
}

export default nextConfig
