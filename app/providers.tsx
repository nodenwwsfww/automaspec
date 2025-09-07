'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { createQueryClient } from '@/lib/query/client'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from '@/components/theme-provider'

export function Providers(props: { children: React.ReactNode }) {
    const [queryClient] = useState(() => createQueryClient())

    return (
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            <QueryClientProvider client={queryClient}>
                <Toaster />
                {props.children}
            </QueryClientProvider>
        </ThemeProvider>
    )
}
