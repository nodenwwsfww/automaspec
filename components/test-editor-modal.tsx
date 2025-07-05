'use client';

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { RichTextEditor } from './rich-text-editor';

interface TestEditorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  test?: any;
  onSave: (test: any) => void;
}

export function TestEditorModal({
  open,
  onOpenChange,
  test,
  onSave,
}: TestEditorModalProps) {
  const [formData, setFormData] = useState({
    name: test?.name || '',
    description: test?.description || '',
    requirements: test?.requirements?.join('\n') || '',
    playwrightCode: test?.playwrightCode || '',
  });

  const isEditing = !!test;

  const handleSave = () => {
    const newTest = {
      ...test,
      id: test?.id || `test-${Date.now()}`,
      name: formData.name,
      description: formData.description,
      requirements: formData.requirements
        .split('\n')
        .filter((req: string) => req.trim()),
      playwrightCode: formData.playwrightCode,
      passed: test?.passed || 0,
      total: test?.total || 1,
      status: test?.status || 'not_run',
      framework: test?.framework || 'Playwright',
    };

    onSave(newTest);
    onOpenChange(false);
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? `Edit ${test.name}` : 'Create New Test'}
          </DialogTitle>
        </DialogHeader>

        <Tabs className="space-y-4" defaultValue="details">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Test Details</TabsTrigger>
            <TabsTrigger value="requirements">Requirements</TabsTrigger>
            <TabsTrigger value="code">Playwright Code</TabsTrigger>
          </TabsList>

          <TabsContent className="space-y-4" value="details">
            <div>
              <Label htmlFor="test-name">Test Name</Label>
              <Input
                id="test-name"
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter test name"
                value={formData.name}
              />
            </div>
            <div>
              <Label>Description</Label>
              <RichTextEditor
                className="mt-2"
                content={formData.description}
                onChange={(content) =>
                  setFormData({ ...formData, description: content })
                }
                placeholder="Describe what this test does..."
              />
            </div>
          </TabsContent>

          <TabsContent className="space-y-4" value="requirements">
            <div>
              <Label>Test Requirements</Label>
              <p className="mb-2 text-muted-foreground text-sm">
                Enter each requirement on a new line. You can use rich text
                formatting.
              </p>
              <RichTextEditor
                className="mt-2"
                content={formData.requirements
                  .split('\n')
                  .map((req: string) => `<p>${req}</p>`)
                  .join('')}
                onChange={(content) => {
                  // Convert HTML back to plain text lines
                  const div = document.createElement('div');
                  div.innerHTML = content;
                  const text = div.textContent || div.innerText || '';
                  setFormData({ ...formData, requirements: text });
                }}
                placeholder="• Requirement 1&#10;• Requirement 2&#10;• Requirement 3"
              />
            </div>
          </TabsContent>

          <TabsContent className="space-y-4" value="code">
            <div>
              <Label htmlFor="playwright-code">Playwright Code</Label>
              <Textarea
                className="min-h-[300px] font-mono text-sm"
                id="playwright-code"
                onChange={(e) =>
                  setFormData({ ...formData, playwrightCode: e.target.value })
                }
                placeholder="describe('Test Suite', () => {&#10;  it('should do something', async ({ page }) => {&#10;    // Test code here&#10;  });&#10;});"
                value={formData.playwrightCode}
              />
            </div>
          </TabsContent>
        </Tabs>

        {/* Actions */}
        <div className="flex justify-end gap-2 border-t pt-4">
          <Button onClick={() => onOpenChange(false)} variant="outline">
            Cancel
          </Button>
          <Button disabled={!formData.name.trim()} onClick={handleSave}>
            {isEditing ? 'Update Test' : 'Create Test'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
