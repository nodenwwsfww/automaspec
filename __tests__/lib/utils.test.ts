import { cn } from '@/lib/utils'
import { expect, test, describe } from 'vitest'

describe('cn utility', () => {
    test('combines classnames', () => {
        const result = cn('foo', 'bar')
        expect(result).toBe('foo bar')
    })

    test('merges tailwind classes', () => {
        const result = cn('px-2 py-1', 'px-4')
        expect(result).toBe('py-1 px-4')
    })

    test('handles undefined and null', () => {
        const result = cn('foo', undefined, null, 'bar')
        expect(result).toBe('foo bar')
    })

    test('handles empty input', () => {
        const result = cn()
        expect(result).toBe('')
    })

    test('handles object classes', () => {
        const result = cn({
            'text-red-500': true,
            'text-blue-500': false,
            'font-bold': true
        })
        expect(result).toBe('text-red-500 font-bold')
    })
})
