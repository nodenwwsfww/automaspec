'use client'

import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'

import { ArrowLeft, Camera, Mail, User, Calendar, MapPin, Save } from 'lucide-react'
import Link from 'next/link'

export default function ProfilePage() {
    const [isEditing, setIsEditing] = useState(false)
    const [profileData, setProfileData] = useState({
        name: 'John Doe',
        email: 'john.doe@example.com',
        bio: 'Senior QA Engineer focused on test automation and quality assurance',
        location: 'San Francisco, CA',
        website: 'https://johndoe.dev',
        joinDate: 'January 2024'
    })

    const [formData, setFormData] = useState(profileData)

    const handleSave = () => {
        setProfileData(formData)
        setIsEditing(false)
        // Here you would typically save to backend
    }

    const handleCancel = () => {
        setFormData(profileData)
        setIsEditing(false)
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container max-w-4xl mx-auto py-8 px-4">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/dashboard">
                        <Button variant="ghost" size="sm" className="mb-4">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Dashboard
                        </Button>
                    </Link>
                    <h1 className="text-3xl font-bold">Profile</h1>
                </div>

                <div className="space-y-6">
                    {/* Profile Header Card */}
                    <Card>
                        <CardHeader>
                            <div className="flex flex-col sm:flex-row gap-6">
                                <div className="relative">
                                    <Avatar className="h-24 w-24">
                                        <AvatarImage src="/placeholder-user.jpg" alt={profileData.name} />
                                        <AvatarFallback className="text-lg">
                                            {profileData.name
                                                .split(' ')
                                                .map((n) => n[0])
                                                .join('')}
                                        </AvatarFallback>
                                    </Avatar>
                                    {isEditing && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                                        >
                                            <Camera className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div>
                                            <h2 className="text-2xl font-bold">{profileData.name}</h2>
                                            <p className="text-muted-foreground">{profileData.email}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            {!isEditing ?
                                                <Button onClick={() => setIsEditing(true)}>
                                                    <User className="h-4 w-4 mr-2" />
                                                    Edit Profile
                                                </Button>
                                            :   <div className="flex gap-2">
                                                    <Button variant="outline" onClick={handleCancel}>
                                                        Cancel
                                                    </Button>
                                                    <Button onClick={handleSave}>
                                                        <Save className="h-4 w-4 mr-2" />
                                                        Save Changes
                                                    </Button>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                    <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <Mail className="h-4 w-4" />
                                            {profileData.email}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <MapPin className="h-4 w-4" />
                                            {profileData.location}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-4 w-4" />
                                            Joined {profileData.joinDate}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                    </Card>

                    {/* Profile Details Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Details</CardTitle>
                            <CardDescription>Update your personal information and preferences</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        disabled={!isEditing}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        disabled={!isEditing}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="location">Location</Label>
                                    <Input
                                        id="location"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        disabled={!isEditing}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="website">Website</Label>
                                    <Input
                                        id="website"
                                        type="url"
                                        value={formData.website}
                                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                        disabled={!isEditing}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="bio">Bio</Label>
                                <Textarea
                                    id="bio"
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    disabled={!isEditing}
                                    rows={3}
                                    placeholder="Tell us about yourself..."
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Plan Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Plan & Billing</CardTitle>
                            <CardDescription>Manage your subscription and billing information</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold">Current Plan</h3>
                                        <Badge variant="secondary">Free Plan</Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Access to basic features and limited test suites
                                    </p>
                                </div>
                                <Button variant="outline">Upgrade Plan</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
