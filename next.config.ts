import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    experimental: {
        browserDebugInfoInTerminal: true,
        typedEnv: true,
        useLightningcss: true
    },
    reactCompiler: true,
    typedRoutes: true,
    images: {
        unoptimized: true // FIXME
    }
}

module.exports = nextConfig
