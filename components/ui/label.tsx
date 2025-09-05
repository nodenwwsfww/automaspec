'use client'

import { Label as LabelPrimitive } from 'radix-ui'
import { cva } from 'class-variance-authority'

import { cn } from '@/lib/utils'
import type { ComponentProps } from 'react'

const labelVariants = cva('text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70')

const Label = ({ ref, className, ...props }: ComponentProps<typeof LabelPrimitive.Root>) => (
    <LabelPrimitive.Root ref={ref} className={cn(labelVariants(), className)} {...props} />
)
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
