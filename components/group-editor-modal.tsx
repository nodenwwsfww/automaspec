'use client'

import { Folder, FileText } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { TestStatus } from '@/lib/types'

const groupTypes = [
    { value: 'group', label: 'Group', icon: Folder, description: 'Container for organizing tests' },
    { value: 'spec', label: 'Spec', icon: FileText, description: 'Test specification' },
    { value: 'test', label: 'Test', icon: FileText, description: 'Individual test case' }
]

const statusOptions: { value: TestStatus; label: string; description: string }[] = [
    { value: 'passed', label: 'Passed', description: 'All tests passed successfully' },
    { value: 'failed', label: 'Failed', description: 'Some tests failed' },
    { value: 'skipped', label: 'Skipped', description: 'Tests were skipped' },
    { value: 'pending', label: 'Pending', description: 'Tests are waiting to run' }
]

interface GroupEditorModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    group?: any
    onSave: (group: any) => void
}

export function GroupEditorModal({ open, onOpenChange, group, onSave }: GroupEditorModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        type: 'group',
        description: '',
        status: 'pending' as TestStatus
    })

    const isEditing = !!group && !group.type // If group.type is passed, it's for creating new item
    const presetType = group?.type // Type preset from button click
    const showTypeSelector = !presetType && !isEditing

    useEffect(() => {
        if (group) {
            setFormData({
                name: group.name || '',
                type: group.type || 'group',
                description: group.description || '',
                status: group.status || 'pending'
            })
        } else {
            setFormData({
                name: '',
                type: presetType || 'group',
                description: '',
                status: 'pending'
            })
        }
    }, [group, presetType, open])

    const handleSave = () => {
        const selectedType = groupTypes.find((t) => t.value === formData.type)
        const newGroup = {
            ...group,
            id: (isEditing && group?.id) || `${formData.type}-${Date.now()}`,
            name: formData.name,
            type: formData.type,
            description: formData.description,
            status: formData.status,
            framework: 'Vitest',
            icon: selectedType?.icon,
            passed: group?.passed || 0,
            total: group?.total || 0,
            children: group?.children || []
        }

        onSave(newGroup)
        onOpenChange(false)
    }

    const selectedType = groupTypes.find((t) => t.value === formData.type)
    const getDialogTitle = () => {
        if (isEditing) return `Edit ${group.name}`
        if (presetType === 'test') return 'Create New Test'
        if (presetType === 'group') return 'Create New Group'
        return 'Create New Item'
    }

    return (
        <Dialog onOpenChange={onOpenChange} open={open}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        {selectedType && <selectedType.icon className="h-5 w-5" />}
                        {getDialogTitle()}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Name */}
                    <div>
                        <Label htmlFor="name" className="mb-1 block">
                            Name
                        </Label>
                        <Input
                            id="name"
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder={`Enter ${selectedType?.label.toLowerCase() || 'item'} name`}
                            value={formData.name}
                        />
                    </div>

                    {/* Type - only show if not preset */}
                    {showTypeSelector && (
                        <div>
                            <Label htmlFor="type" className="mb-1 block">
                                Type
                            </Label>
                            <Select
                                onValueChange={(value) => setFormData({ ...formData, type: value })}
                                value={formData.type}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {groupTypes.map((type) => {
                                        const IconComponent = type.icon
                                        return (
                                            <SelectItem key={type.value} value={type.value}>
                                                <div className="flex items-center gap-2">
                                                    <IconComponent className="h-4 w-4" />
                                                    <div>
                                                        <div className="font-medium">{type.label}</div>
                                                        <div className="text-xs text-muted-foreground">
                                                            {type.description}
                                                        </div>
                                                    </div>
                                                </div>
                                            </SelectItem>
                                        )
                                    })}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {/* Description */}
                    <div>
                        <Label htmlFor="description" className="mb-1 block">
                            Description (optional)
                        </Label>
                        <Textarea
                            id="description"
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder={`Describe this ${selectedType?.label.toLowerCase() || 'item'}...`}
                            rows={3}
                            value={formData.description}
                        />
                    </div>

                    {/* Status - only show for specs */}
                    {formData.type === 'spec' && (
                        <div>
                            <Label htmlFor="status" className="mb-1 block">
                                Status
                            </Label>
                            <Select
                                onValueChange={(value) => setFormData({ ...formData, status: value as TestStatus })}
                                value={formData.status}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {statusOptions.map((status) => (
                                        <SelectItem key={status.value} value={status.value}>
                                            <div>
                                                <div className="font-medium">{status.label}</div>
                                                <div className="text-xs text-muted-foreground">
                                                    {status.description}
                                                </div>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex justify-end gap-2 pt-4">
                        <Button onClick={() => onOpenChange(false)} variant="outline">
                            Cancel
                        </Button>
                        <Button disabled={!formData.name.trim()} onClick={handleSave}>
                            {isEditing ? 'Update' : 'Create'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
