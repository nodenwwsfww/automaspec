import type { Metadata } from 'next';
import './globals.css';
import { ReactPlugin } from '@21st-extension/react';
import { TwentyFirstToolbar } from '@21st-extension/toolbar-next';
import { ThemeProvider } from '@/components/theme-provider';
import '../lib/orpc.server' // for pre-rendering

export const metadata: Metadata = {
  title: 'Automaspeq',
  description: 'Automaspeq - Your AI-powered solution for automating your business processes',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
          enableSystem
        >
          {children}
        </ThemeProvider>
      </body>
      {/* <TwentyFirstToolbar config={{ plugins: [ReactPlugin] }} /> */}
    </html>
  );
}
