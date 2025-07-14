import type { Metadata } from 'next'
import './globals.css'
// import { ReactPlugin } from '@21st-extension/react';
// import { TwentyFirstToolbar } from '@21st-extension/toolbar-next';
import '../lib/orpc.server' // for pre-rendering
import { Providers } from './providers'

export const metadata: Metadata = {
    title: 'Automaspec',
    description: 'Automaspec - Your AI-powered solution for automating your business processes'
}

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <script crossOrigin="anonymous" src="//unpkg.com/react-scan/dist/auto.global.js" />
            </head>
            <body>
                <Providers>{children}</Providers>
            </body>
            {/* <TwentyFirstToolbar config={{ plugins: [ReactPlugin] }} /> */}
        </html>
    )
}
