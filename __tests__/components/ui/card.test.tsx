import { render, screen } from '@testing-library/react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardAction } from '@/components/ui/card'
import { expect, test, describe } from 'vitest'

describe('Card', () => {
    test('renders basic card', () => {
        render(<Card>Card content</Card>)
        const card = screen.getByText('Card content')
        expect(card).toBeDefined()
        expect(card.className).toContain('bg-card')
    })

    test('renders card with custom className', () => {
        render(<Card className="custom-card">Custom card</Card>)
        expect(screen.getByText('Custom card').className).toContain('custom-card')
    })

    test('renders complete card structure', () => {
        render(
            <Card>
                <CardHeader>
                    <CardTitle>Card Title</CardTitle>
                    <CardDescription>Card Description</CardDescription>
                </CardHeader>
                <CardContent>Card Content</CardContent>
                <CardFooter>Card Footer</CardFooter>
            </Card>
        )

        expect(screen.getByText('Card Title')).toBeDefined()
        expect(screen.getByText('Card Description')).toBeDefined()
        expect(screen.getByText('Card Content')).toBeDefined()
        expect(screen.getByText('Card Footer')).toBeDefined()
    })

    test('renders card with action', () => {
        render(
            <Card>
                <CardHeader>
                    <CardTitle>Card with Action</CardTitle>
                    <CardAction>Action</CardAction>
                </CardHeader>
                <CardContent>Content</CardContent>
            </Card>
        )

        expect(screen.getByText('Card with Action')).toBeDefined()
        expect(screen.getByText('Action')).toBeDefined()
        expect(screen.getByText('Content')).toBeDefined()
    })

    test('card components have correct data attributes', () => {
        render(
            <Card>
                <CardHeader>
                    <CardTitle>Title</CardTitle>
                    <CardDescription>Description</CardDescription>
                </CardHeader>
                <CardContent>Content</CardContent>
                <CardFooter>Footer</CardFooter>
            </Card>
        )

        expect(screen.getByText('Title').getAttribute('data-slot')).toBe('card-title')
        expect(screen.getByText('Description').getAttribute('data-slot')).toBe('card-description')
        expect(screen.getByText('Content').getAttribute('data-slot')).toBe('card-content')
        expect(screen.getByText('Footer').getAttribute('data-slot')).toBe('card-footer')
    })

    test('card has correct data attribute', () => {
        render(<Card>Test Card</Card>)
        const card = screen.getByText('Test Card')
        expect(card.getAttribute('data-slot')).toBe('card')
    })
})
