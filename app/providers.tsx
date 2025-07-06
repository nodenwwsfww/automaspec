'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { createQueryClient } from '@/lib/query/client';
import { ThemeProvider } from '@/components/theme-provider';

export function Providers(props: { children: React.ReactNode }) {
  const [queryClient] = useState(() => createQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
       <ThemeProvider
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
          enableSystem
        >
          {props.children}
        </ThemeProvider>
    </QueryClientProvider>
  );
}
