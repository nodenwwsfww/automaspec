import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    experimental: {
        browserDebugInfoInTerminal: true,
        typedEnv: true,
        // useLightningcss: true,
        devtoolSegmentExplorer: true
    },
    typedRoutes: true,
    eslint: {
        ignoreDuringBuilds: true
    },
    typescript: {
        ignoreBuildErrors: false
    },
    images: {
        unoptimized: true // FIXME
    }
}

export default nextConfig
