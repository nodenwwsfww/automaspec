'use client'

import { SpacemanThemeProvider } from '@space-man/react-theme-animation'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import type { ComponentProps } from 'react'

export function ThemeProvider({ children, ...props }: ComponentProps<typeof NextThemesProvider>) {
    return (
        <NextThemesProvider {...props} attribute="class">
            <SpacemanThemeProvider
                themes={['light', 'dark', 'system']}
                defaultTheme="system"
                defaultColorTheme="default"
            >
                {children}
            </SpacemanThemeProvider>
        </NextThemesProvider>
    )
}
