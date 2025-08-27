import type { Metadata } from 'next'
import './globals.css'
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
                {process.env.NODE_ENV === 'development' && (
                    <script crossOrigin="anonymous" async src="//unpkg.com/react-scan/dist/auto.global.js" />
                )}
            </head>
            <body>
                <Providers>{children}</Providers>
            </body>
        </html>
    )
}
