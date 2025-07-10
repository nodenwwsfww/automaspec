import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { testCategories, testGroup, test, testRequirement } from '@/db/schema/tests'

export async function GET() {
    try {
        const categories = await db.select().from(testCategories)
        const groups = await db.select().from(testGroup)
        const tests = await db.select().from(test)
        const requirements = await db.select().from(testRequirement)

        return NextResponse.json({
            categories,
            groups,
            tests,
            requirements
        })
    } catch (error) {
        console.error('Error fetching test data:', error)
        return NextResponse.json({ error: 'Failed to fetch test data' }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { type, data } = body

        let result
        switch (type) {
            case 'category':
                result = await db
                    .insert(testCategories)
                    .values({
                        id: crypto.randomUUID(),
                        ...data,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    })
                    .returning()
                break
            case 'group':
                result = await db
                    .insert(testGroup)
                    .values({
                        id: crypto.randomUUID(),
                        ...data,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    })
                    .returning()
                break
            case 'test':
                result = await db
                    .insert(test)
                    .values({
                        id: crypto.randomUUID(),
                        ...data,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    })
                    .returning()
                break
            case 'requirement':
                result = await db
                    .insert(testRequirement)
                    .values({
                        id: crypto.randomUUID(),
                        ...data,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    })
                    .returning()
                break
            default:
                return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
        }

        return NextResponse.json(result[0])
    } catch (error) {
        console.error('Error creating test data:', error)
        return NextResponse.json({ error: 'Failed to create test data' }, { status: 500 })
    }
}
