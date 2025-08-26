import { render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/button'
import { expect, test, describe } from 'vitest'
import { vi } from 'vitest'

describe('Button', () => {
    test('renders with default props', () => {
        render(<Button>Click me</Button>)
        const button = screen.getByRole('button', { name: 'Click me' })
        expect(button).toBeDefined()
        expect(button.className).toContain('bg-primary')
    })

    test('renders with different variants', () => {
        const { rerender } = render(<Button variant="destructive">Delete</Button>)
        expect(screen.getByRole('button').className).toContain('bg-destructive')

        rerender(<Button variant="outline">Outline</Button>)
        expect(screen.getByRole('button').className).toContain('border')

        rerender(<Button variant="secondary">Secondary</Button>)
        expect(screen.getByRole('button').className).toContain('bg-secondary')

        rerender(<Button variant="ghost">Ghost</Button>)
        expect(screen.getByRole('button').className).toContain('hover:bg-accent')

        rerender(<Button variant="link">Link</Button>)
        expect(screen.getByRole('button').className).toContain('text-primary')
    })

    test('renders with different sizes', () => {
        const { rerender } = render(<Button size="sm">Small</Button>)
        expect(screen.getByRole('button').className).toContain('h-8')

        rerender(<Button size="lg">Large</Button>)
        expect(screen.getByRole('button').className).toContain('h-10')

        rerender(<Button size="icon">Icon</Button>)
        expect(screen.getByRole('button').className).toContain('size-9')
    })

    test('handles click events', () => {
        const handleClick = vi.fn()
        render(<Button onClick={handleClick}>Click me</Button>)

        screen.getByRole('button').click()
        expect(handleClick).toHaveBeenCalledTimes(1)
    })

    test('can be disabled', () => {
        render(<Button disabled>Disabled</Button>)
        const button = screen.getByRole('button')
        expect(button.disabled).toBe(true)
        expect(button.className).toContain('disabled:opacity-50')
    })

    test('renders with custom className', () => {
        render(<Button className="custom-class">Custom</Button>)
        expect(screen.getByRole('button').className).toContain('custom-class')
    })

    test('has correct data attribute', () => {
        render(<Button>Test</Button>)
        const button = screen.getByRole('button')
        expect(button.getAttribute('data-slot')).toBe('button')
    })
})
