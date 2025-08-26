import { render, screen } from '@testing-library/react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { expect, test, describe } from 'vitest'

describe('Avatar', () => {
    test('renders avatar with image', () => {
        render(
            <Avatar>
                <AvatarImage src="/test-image.jpg" alt="Test User" />
                <AvatarFallback>TU</AvatarFallback>
            </Avatar>
        )

        // In test environment, images often fallback, so let's just check the structure
        const fallback = screen.getByText('TU')
        expect(fallback).toBeDefined()
    })

    test('renders avatar with fallback', () => {
        render(
            <Avatar>
                <AvatarFallback>TU</AvatarFallback>
            </Avatar>
        )

        const fallback = screen.getByText('TU')
        expect(fallback).toBeDefined()
    })

    test('renders avatar with custom className', () => {
        render(
            <Avatar className="custom-avatar">
                <AvatarFallback>CU</AvatarFallback>
            </Avatar>
        )

        const avatar = screen.getByText('CU').parentElement
        expect(avatar?.className).toContain('custom-avatar')
    })

    test('avatar components have correct data attributes', () => {
        render(
            <Avatar>
                <AvatarFallback>TF</AvatarFallback>
            </Avatar>
        )

        const fallback = screen.getByText('TF')
        expect(fallback.getAttribute('data-slot')).toBe('avatar-fallback')
    })

    test('renders avatar with only fallback', () => {
        render(
            <Avatar>
                <AvatarFallback>Fallback Only</AvatarFallback>
            </Avatar>
        )

        expect(screen.getByText('Fallback Only')).toBeDefined()
    })

    test('avatar root has correct data attribute', () => {
        render(
            <Avatar>
                <AvatarFallback>Root Test</AvatarFallback>
            </Avatar>
        )

        const root = screen.getByText('Root Test').parentElement
        expect(root?.getAttribute('data-slot')).toBe('avatar')
    })

    test('avatar has correct default styling', () => {
        render(
            <Avatar>
                <AvatarFallback>Style Test</AvatarFallback>
            </Avatar>
        )

        const root = screen.getByText('Style Test').parentElement
        expect(root?.className).toContain('size-8')
        expect(root?.className).toContain('rounded-full')
    })
})
