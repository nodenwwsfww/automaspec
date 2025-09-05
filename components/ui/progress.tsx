'use client'

import { Progress as ProgressPrimitive } from 'radix-ui'

import { cn } from '@/lib/utils'
import type { ComponentProps } from 'react'

const Progress = ({ ref, className, value, ...props }: ComponentProps<typeof ProgressPrimitive.Root>) => (
    <ProgressPrimitive.Root
        ref={ref}
        className={cn('relative h-4 w-full overflow-hidden rounded-full bg-secondary', className)}
        {...props}
    >
        <ProgressPrimitive.Indicator
            className="h-full w-full flex-1 bg-primary transition-all"
            style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
        />
    </ProgressPrimitive.Root>
)
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
