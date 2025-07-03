"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RichTextEditor } from "./rich-text-editor"
import { Globe, Server, Smartphone, User, Database, Code2, MessageSquare } from "lucide-react"

const groupTypes = [
  { value: "frontend", label: "Frontend", icon: Globe },
  { value: "backend", label: "Backend", icon: Server },
  { value: "mobile", label: "Mobile", icon: Smartphone },
  { value: "feature", label: "Feature", icon: User },
  { value: "component", label: "Component", icon: MessageSquare },
  { value: "api", label: "API", icon: Code2 },
  { value: "database", label: "Database", icon: Database },
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
    name: group?.name || "",
    description: group?.description || "",
    type: group?.type || "component",
    framework: group?.framework || "Playwright",
  })

  const isEditing = !!group

  const handleSave = () => {
    const selectedType = groupTypes.find((t) => t.value === formData.type)
    const newGroup = {
      ...group,
      id: group?.id || `group-${Date.now()}`,
      name: formData.name,
      description: formData.description,
      type: formData.type,
      framework: formData.framework,
      icon: selectedType?.icon,
      passed: group?.passed || 0,
      total: group?.total || 0,
      status: group?.status || "not_run",
      children: group?.children || [],
    }

    onSave(newGroup)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? `Edit ${group.name}` : `Create New ${parentGroup ? "Sub-" : ""}Group`}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter group name"
              />
            </div>
            <div>
              <Label htmlFor="type">Type</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {groupTypes.map((type) => {
                    const IconComponent = type.icon
                    return (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <IconComponent className="w-4 h-4" />
                          {type.label}
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Framework Selection */}
          <div>
            <Label htmlFor="framework">Framework</Label>
            <Select
              value={formData.framework}
              onValueChange={(value) => setFormData({ ...formData, framework: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Playwright">Playwright</SelectItem>
                <SelectItem value="VTest">VTest</SelectItem>
                <SelectItem value="JST">JST</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div>
            <Label>Description</Label>
            <RichTextEditor
              content={formData.description}
              onChange={(content) => setFormData({ ...formData, description: content })}
              placeholder="Describe what this group tests..."
              className="mt-2"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!formData.name.trim()}>
              {isEditing ? "Update Group" : "Create Group"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
