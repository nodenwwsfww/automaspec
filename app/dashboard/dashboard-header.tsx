'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { authClient } from '@/lib/shared/better-auth'
import { Folder, Plus, User, Settings, LogOut } from 'lucide-react'
import Link from 'next/link'

interface DashboardHeaderProps {
    onCreateGroup: () => void
    onCreateTest: () => void
}

export function DashboardHeader({ onCreateGroup, onCreateTest }: DashboardHeaderProps) {
    const onSignOut = async () => {
        await authClient.signOut({
            // fetchOptions: {
            //     onSuccess: () => {
            //         router.push('/login')
            //     }
            // }
        })
    }

    return (
        <div className="flex items-center justify-between border-b p-4">
            <div className="flex items-center gap-4">
                <h1 className="font-semibold text-lg">Test Structure</h1>
                <Badge variant="secondary">Free Plan</Badge>
            </div>
            <div className="flex items-center gap-2">
                <Button onClick={onCreateGroup} size="sm" variant="outline">
                    <Folder className="mr-2 h-4 w-4" />
                    New Group
                </Button>

                <Button onClick={onCreateTest} size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    New Test
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="ghost">
                            <User className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                            <Link href="/profile">
                                <User className="mr-2 h-4 w-4" />
                                Profile
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/settings">
                                <Settings className="mr-2 h-4 w-4" />
                                Settings
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/login" onClick={onSignOut}>
                                <LogOut className="mr-2 h-4 w-4" />
                                Logout
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}
