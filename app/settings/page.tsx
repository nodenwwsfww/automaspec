'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { ModeToggle } from '@/components/theme-toggler'
import { ArrowLeft, Bell, Shield, Palette, Code, Download, Trash2, AlertTriangle, Save, Zap } from 'lucide-react'
import Link from 'next/link'

export default function SettingsPage() {
    const [settings, setSettings] = useState({
        notifications: {
            email: true,
            push: false,
            testResults: true,
            weeklyReports: true,
            newFeatures: false
        },
        preferences: {
            defaultFramework: 'vitest',
            autoSave: true,
            showLineNumbers: true,
            language: 'en',
            timezone: 'UTC-8'
        },
        privacy: {
            profileVisible: true,
            dataSharing: false,
            analytics: true
        }
    })

    const updateSetting = (category: string, key: string, value: any) => {
        setSettings((prev) => ({
            ...prev,
            [category]: {
                ...prev[category as keyof typeof prev],
                [key]: value
            }
        }))
    }

    const handleSaveSettings = () => {
        // Here you would typically save to backend
        console.log('Saving settings:', settings)
    }

    const handleExportData = () => {
        // Export user data functionality
        console.log('Exporting data...')
    }

    const handleDeleteAccount = () => {
        // Account deletion functionality
        console.log('Account deletion requested...')
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
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold">Settings</h1>
                        <Button onClick={handleSaveSettings}>
                            <Save className="h-4 w-4 mr-2" />
                            Save Changes
                        </Button>
                    </div>
                </div>

                <Tabs defaultValue="general" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="general">General</TabsTrigger>
                        <TabsTrigger value="notifications">Notifications</TabsTrigger>
                        <TabsTrigger value="privacy">Privacy</TabsTrigger>
                        <TabsTrigger value="account">Account</TabsTrigger>
                    </TabsList>

                    <TabsContent value="general" className="space-y-6">
                        {/* Appearance Settings */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Palette className="h-5 w-5" />
                                    <CardTitle>Appearance</CardTitle>
                                </div>
                                <CardDescription>Customize the look and feel of your application</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label className="text-base">Theme</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Choose your preferred color scheme
                                        </p>
                                    </div>
                                    <ModeToggle />
                                </div>
                                <Separator />
                                <div className="space-y-3">
                                    <Label className="text-base">Language</Label>
                                    <Select
                                        value={settings.preferences.language}
                                        onValueChange={(value) => updateSetting('preferences', 'language', value)}
                                    >
                                        <SelectTrigger className="w-48">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="en">English</SelectItem>
                                            <SelectItem value="es">Español</SelectItem>
                                            <SelectItem value="fr">Français</SelectItem>
                                            <SelectItem value="de">Deutsch</SelectItem>
                                            <SelectItem value="ru">Русский</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-base">Timezone</Label>
                                    <Select
                                        value={settings.preferences.timezone}
                                        onValueChange={(value) => updateSetting('preferences', 'timezone', value)}
                                    >
                                        <SelectTrigger className="w-48">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="UTC-8">Pacific Time (UTC-8)</SelectItem>
                                            <SelectItem value="UTC-5">Eastern Time (UTC-5)</SelectItem>
                                            <SelectItem value="UTC+0">GMT (UTC+0)</SelectItem>
                                            <SelectItem value="UTC+1">Central European (UTC+1)</SelectItem>
                                            <SelectItem value="UTC+3">Moscow (UTC+3)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Test Framework Settings */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Code className="h-5 w-5" />
                                    <CardTitle>Test Framework</CardTitle>
                                </div>
                                <CardDescription>Configure your testing environment preferences</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-3">
                                    <Label className="text-base">Default Framework</Label>
                                    <Select
                                        value={settings.preferences.defaultFramework}
                                        onValueChange={(value) =>
                                            updateSetting('preferences', 'defaultFramework', value)
                                        }
                                    >
                                        <SelectTrigger className="w-48">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="vitest">Vitest</SelectItem>
                                            <SelectItem value="jest" disabled>
                                                Jest (Coming Soon)
                                            </SelectItem>
                                            <SelectItem value="cypress" disabled>
                                                Cypress (Coming Soon)
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label className="text-base">Auto-save changes</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Automatically save test modifications
                                        </p>
                                    </div>
                                    <Switch
                                        checked={settings.preferences.autoSave}
                                        onCheckedChange={(checked) => updateSetting('preferences', 'autoSave', checked)}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label className="text-base">Show line numbers</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Display line numbers in code editor
                                        </p>
                                    </div>
                                    <Switch
                                        checked={settings.preferences.showLineNumbers}
                                        onCheckedChange={(checked) =>
                                            updateSetting('preferences', 'showLineNumbers', checked)
                                        }
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="notifications" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Bell className="h-5 w-5" />
                                    <CardTitle>Notification Preferences</CardTitle>
                                </div>
                                <CardDescription>Choose what notifications you want to receive</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label className="text-base">Email notifications</Label>
                                        <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                                    </div>
                                    <Switch
                                        checked={settings.notifications.email}
                                        onCheckedChange={(checked) => updateSetting('notifications', 'email', checked)}
                                    />
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label className="text-base">Push notifications</Label>
                                        <p className="text-sm text-muted-foreground">Get browser push notifications</p>
                                    </div>
                                    <Switch
                                        checked={settings.notifications.push}
                                        onCheckedChange={(checked) => updateSetting('notifications', 'push', checked)}
                                    />
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label className="text-base">Test result notifications</Label>
                                        <p className="text-sm text-muted-foreground">Notify when test runs complete</p>
                                    </div>
                                    <Switch
                                        checked={settings.notifications.testResults}
                                        onCheckedChange={(checked) =>
                                            updateSetting('notifications', 'testResults', checked)
                                        }
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label className="text-base">Weekly reports</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Receive weekly test summary reports
                                        </p>
                                    </div>
                                    <Switch
                                        checked={settings.notifications.weeklyReports}
                                        onCheckedChange={(checked) =>
                                            updateSetting('notifications', 'weeklyReports', checked)
                                        }
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label className="text-base">New feature announcements</Label>
                                        <p className="text-sm text-muted-foreground">Get notified about new features</p>
                                    </div>
                                    <Switch
                                        checked={settings.notifications.newFeatures}
                                        onCheckedChange={(checked) =>
                                            updateSetting('notifications', 'newFeatures', checked)
                                        }
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="privacy" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Shield className="h-5 w-5" />
                                    <CardTitle>Privacy & Security</CardTitle>
                                </div>
                                <CardDescription>Control your privacy and data sharing preferences</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label className="text-base">Public profile</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Make your profile visible to other users
                                        </p>
                                    </div>
                                    <Switch
                                        checked={settings.privacy.profileVisible}
                                        onCheckedChange={(checked) =>
                                            updateSetting('privacy', 'profileVisible', checked)
                                        }
                                    />
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label className="text-base">Data sharing</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Share anonymized usage data to improve the service
                                        </p>
                                    </div>
                                    <Switch
                                        checked={settings.privacy.dataSharing}
                                        onCheckedChange={(checked) => updateSetting('privacy', 'dataSharing', checked)}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label className="text-base">Analytics</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Allow analytics tracking for better user experience
                                        </p>
                                    </div>
                                    <Switch
                                        checked={settings.privacy.analytics}
                                        onCheckedChange={(checked) => updateSetting('privacy', 'analytics', checked)}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="account" className="space-y-6">
                        {/* Plan Information */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Zap className="h-5 w-5" />
                                    <CardTitle>Subscription</CardTitle>
                                </div>
                                <CardDescription>Manage your plan and billing preferences</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between p-4 border rounded-lg">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold">Free Plan</h3>
                                            <Badge variant="secondary">Current</Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Basic features with limited test suites
                                        </p>
                                    </div>
                                    <Button>Upgrade Plan</Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Data Export */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Download className="h-5 w-5" />
                                    <CardTitle>Data Export</CardTitle>
                                </div>
                                <CardDescription>Download your data for backup or migration</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">Export your data</p>
                                        <p className="text-sm text-muted-foreground">
                                            Download all your tests, requirements, and settings
                                        </p>
                                    </div>
                                    <Button variant="outline" onClick={handleExportData}>
                                        <Download className="h-4 w-4 mr-2" />
                                        Export Data
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Danger Zone */}
                        <Card className="border-red-200">
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <AlertTriangle className="h-5 w-5 text-red-600" />
                                    <CardTitle className="text-red-600">Danger Zone</CardTitle>
                                </div>
                                <CardDescription>Irreversible and destructive actions</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                                    <div>
                                        <p className="font-medium text-red-800">Delete Account</p>
                                        <p className="text-sm text-red-600">
                                            Permanently delete your account and all associated data
                                        </p>
                                    </div>
                                    <Button variant="destructive" onClick={handleDeleteAccount}>
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete Account
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
