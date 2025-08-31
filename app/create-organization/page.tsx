'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from '@tanstack/react-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Building2 } from 'lucide-react'
import { authClient } from '@/lib/shared/better-auth'
import { toast } from 'sonner'

export default function CreateOrganizationPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const form = useForm({
        defaultValues: {
            name: '',
            slug: ''
        },
        onSubmit: async ({ value }) => {
            setIsLoading(true)
            setError(null)

            try {
                console.log('Creating organization with:', { name: value.name, slug: value.slug })

                const result = await authClient.organization.create({
                    name: value.name,
                    slug: value.slug
                })

                console.log('Organization creation result:', result)

                if (result.error) {
                    setError(result.error.message || 'Failed to create organization')
                    return
                }

                toast.success('Organization created successfully!')
                router.push('/dashboard')
            } catch (err) {
                setError('An unexpected error occurred')
                console.error('Organization creation error:', err)
            } finally {
                setIsLoading(false)
            }
        }
    })

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                        <Building2 className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <CardTitle>Create Your Organization</CardTitle>
                    <CardDescription>Set up your workspace to get started with TestAssist</CardDescription>
                </CardHeader>
                <CardContent>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            form.handleSubmit()
                        }}
                        className="space-y-4"
                    >
                        <form.Field
                            name="name"
                            validators={{
                                onChange: ({ value }) => (!value ? 'Organization name is required' : undefined),
                                onChangeAsyncDebounceMs: 500,
                                onChangeAsync: async ({ value }) => {
                                    if (!value) return 'Organization name is required'
                                    if (value.length < 2) return 'Name must be at least 2 characters'
                                    if (value.length > 50) return 'Name must be less than 50 characters'
                                }
                            }}
                        >
                            {(field) => (
                                <div className="space-y-2">
                                    <Label htmlFor="name">Organization Name</Label>
                                    <Input
                                        id="name"
                                        name={field.name}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => {
                                            field.handleChange(e.target.value)
                                            // Auto-generate slug from name
                                            const slug = generateSlug(e.target.value)
                                            form.setFieldValue('slug', slug)
                                        }}
                                        placeholder="Acme Inc."
                                        disabled={isLoading}
                                    />
                                    {field.state.meta.errors && (
                                        <p className="text-sm text-destructive">{field.state.meta.errors[0]}</p>
                                    )}
                                </div>
                            )}
                        </form.Field>

                        <form.Field
                            name="slug"
                            validators={{
                                onChange: ({ value }) => (!value ? 'Organization slug is required' : undefined),
                                onChangeAsyncDebounceMs: 500,
                                onChangeAsync: async ({ value }) => {
                                    if (!value) return 'Organization slug is required'
                                    if (value.length < 2) return 'Slug must be at least 2 characters'
                                    if (value.length > 50) return 'Slug must be less than 50 characters'
                                    if (!/^[a-z0-9-]+$/.test(value)) {
                                        return 'Slug can only contain lowercase letters, numbers, and hyphens'
                                    }

                                    // Check if slug is available
                                    try {
                                        const result = await authClient.organization.checkSlug({
                                            slug: value
                                        })
                                        if (result.error || !result.data?.status) {
                                            return 'This slug is already taken'
                                        }
                                    } catch (err) {
                                        console.error('Slug check error:', err)
                                    }
                                }
                            }}
                        >
                            {(field) => (
                                <div className="space-y-2">
                                    <Label htmlFor="slug">Organization Slug</Label>
                                    <Input
                                        id="slug"
                                        name={field.name}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        placeholder="acme-inc"
                                        disabled={isLoading}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Used in URLs: testassist.com/{field.state.value || 'your-slug'}
                                    </p>
                                    {field.state.meta.errors && (
                                        <p className="text-sm text-destructive">{field.state.meta.errors[0]}</p>
                                    )}
                                </div>
                            )}
                        </form.Field>

                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
                            {([canSubmit, isSubmitting]) => (
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={!canSubmit || isSubmitting || isLoading}
                                >
                                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Create Organization
                                </Button>
                            )}
                        </form.Subscribe>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
