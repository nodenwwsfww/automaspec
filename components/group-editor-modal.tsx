'use client'

import { Folder, FileText } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

const groupTypes = [
    { value: 'group', label: 'Group', icon: Folder, description: 'Container for organizing tests' },
    { value: 'test', label: 'Test', icon: FileText, description: 'Individual test case' }
]

interface GroupEditorModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    group?: any
    onSave: (group: any) => void
    parentGroup?: any
}

export function GroupEditorModal({ open, onOpenChange, group, onSave, parentGroup }: GroupEditorModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        type: 'group',
        description: ''
    })

    const isEditing = !!group && !group.type // If group.type is passed, it's for creating new item
    const presetType = group?.type // Type preset from button click
    const showTypeSelector = !presetType && !isEditing

    useEffect(() => {
        if (group) {
            setFormData({
                name: group.name || '',
                type: group.type || 'group',
                description: group.description || ''
            })
        } else {
            setFormData({
                name: '',
                type: presetType || 'group',
                description: ''
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
            framework: 'Vitest',
            icon: selectedType?.icon,
            passed: group?.passed || 0,
            total: group?.total || 0,
            status: group?.status || 'pending',
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
