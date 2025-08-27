import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    experimental: {
        browserDebugInfoInTerminal: true
    },
    eslint: {
        ignoreDuringBuilds: true
    },
    typescript: {
        ignoreBuildErrors: false
    },
    images: {
        unoptimized: true
    }
}

export default nextConfig
