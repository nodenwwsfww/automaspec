'use client';

import {
  Code2,
  Database,
  Globe,
  MessageSquare,
  Server,
  Smartphone,
  User,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const groupTypes = [
  { value: 'frontend', label: 'Frontend', icon: Globe },
  { value: 'backend', label: 'Backend', icon: Server },
  { value: 'mobile', label: 'Mobile', icon: Smartphone },
  { value: 'feature', label: 'Feature', icon: User },
  { value: 'component', label: 'Component', icon: MessageSquare },
  { value: 'api', label: 'API', icon: Code2 },
  { value: 'database', label: 'Database', icon: Database },
];

interface GroupEditorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  group?: any;
  onSave: (group: any) => void;
  parentGroup?: any;
}

export function GroupEditorModal({
  open,
  onOpenChange,
  group,
  onSave,
  parentGroup,
}: GroupEditorModalProps) {
  const [formData, setFormData] = useState({
    name: group?.name || '',
    type: group?.type || 'component',
    framework: group?.framework || 'Playwright',
  });

  const isEditing = !!group;

  const handleSave = () => {
    const selectedType = groupTypes.find((t) => t.value === formData.type);
    const newGroup = {
      ...group,
      id: group?.id || `group-${Date.now()}`,
      name: formData.name,
      type: formData.type,
      framework: formData.framework,
      icon: selectedType?.icon,
      passed: group?.passed || 0,
      total: group?.total || 0,
      status: group?.status || 'not_run',
      children: group?.children || [],
    };

    onSave(newGroup);
    onOpenChange(false);
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing
              ? `Edit ${group.name}`
              : `Create New ${parentGroup ? 'Sub-' : ''}Group`}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter group name"
                value={formData.name}
              />
            </div>
            <div>
              <Label htmlFor="type">Type</Label>
              <Select
                onValueChange={(value) =>
                  setFormData({ ...formData, type: value })
                }
                value={formData.type}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {groupTypes.map((type) => {
                    const IconComponent = type.icon;
                    return (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <IconComponent className="h-4 w-4" />
                          {type.label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Framework Selection */}
          <div>
            <Label htmlFor="framework">Framework</Label>
            <Select
              onValueChange={(value) =>
                setFormData({ ...formData, framework: value })
              }
              value={formData.framework}
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

          {/* Actions */}
          <div className="flex justify-end gap-2 border-t pt-4">
            <Button onClick={() => onOpenChange(false)} variant="outline">
              Cancel
            </Button>
            <Button disabled={!formData.name.trim()} onClick={handleSave}>
              {isEditing ? 'Update Group' : 'Create Group'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
