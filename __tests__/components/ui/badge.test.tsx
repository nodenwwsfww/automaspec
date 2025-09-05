import { render, screen } from '@testing-library/react'
import { Badge } from '@/components/ui/badge'
import { expect, test, describe } from 'vitest'

describe('Badge', () => {
    test('renders with default props', () => {
        render(<Badge>Default Badge</Badge>)
        const badge = screen.getByText('Default Badge')
        expect(badge).toBeDefined()
        expect(badge.className).toContain('bg-primary')
    })

    test('renders with different variants', () => {
        const { rerender } = render(<Badge variant="secondary">Secondary</Badge>)
        expect(screen.getByText('Secondary').className).toContain('bg-secondary')

        rerender(<Badge variant="destructive">Destructive</Badge>)
        expect(screen.getByText('Destructive').className).toContain('bg-destructive')

        rerender(<Badge variant="outline">Outline</Badge>)
        expect(screen.getByText('Outline').className).toContain('text-foreground')
    })

    test('renders with custom className', () => {
        render(<Badge className="custom-badge">Custom</Badge>)
        expect(screen.getByText('Custom').className).toContain('custom-badge')
    })

    test('has correct data attribute', () => {
        render(<Badge>Test Badge</Badge>)
        const badge = screen.getByText('Test Badge')
        expect(badge.getAttribute('data-slot')).toBe('badge')
    })

    test('renders as span by default', () => {
        render(<Badge>Span Badge</Badge>)
        const badge = screen.getByText('Span Badge')
        expect(badge.tagName).toBe('SPAN')
    })
})
