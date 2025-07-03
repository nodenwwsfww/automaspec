"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RichTextEditor } from "./rich-text-editor"
import { Textarea } from "@/components/ui/textarea"

interface TestEditorModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  test?: any
  onSave: (test: any) => void
}

export function TestEditorModal({ open, onOpenChange, test, onSave }: TestEditorModalProps) {
  const [formData, setFormData] = useState({
    name: test?.name || "",
    description: test?.description || "",
    requirements: test?.requirements?.join("\n") || "",
    playwrightCode: test?.playwrightCode || "",
  })

  const isEditing = !!test

  const handleSave = () => {
    const newTest = {
      ...test,
      id: test?.id || `test-${Date.now()}`,
      name: formData.name,
      description: formData.description,
      requirements: formData.requirements.split("\n").filter((req) => req.trim()),
      playwrightCode: formData.playwrightCode,
      passed: test?.passed || 0,
      total: test?.total || 1,
      status: test?.status || "not_run",
      framework: test?.framework || "Playwright",
    }

    onSave(newTest)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? `Edit ${test.name}` : "Create New Test"}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="details" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Test Details</TabsTrigger>
            <TabsTrigger value="requirements">Requirements</TabsTrigger>
            <TabsTrigger value="code">Playwright Code</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <div>
              <Label htmlFor="test-name">Test Name</Label>
              <Input
                id="test-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter test name"
              />
            </div>
            <div>
              <Label>Description</Label>
              <RichTextEditor
                content={formData.description}
                onChange={(content) => setFormData({ ...formData, description: content })}
                placeholder="Describe what this test does..."
                className="mt-2"
              />
            </div>
          </TabsContent>

          <TabsContent value="requirements" className="space-y-4">
            <div>
              <Label>Test Requirements</Label>
              <p className="text-sm text-muted-foreground mb-2">
                Enter each requirement on a new line. You can use rich text formatting.
              </p>
              <RichTextEditor
                content={formData.requirements
                  .split("\n")
                  .map((req) => `<p>${req}</p>`)
                  .join("")}
                onChange={(content) => {
                  // Convert HTML back to plain text lines
                  const div = document.createElement("div")
                  div.innerHTML = content
                  const text = div.textContent || div.innerText || ""
                  setFormData({ ...formData, requirements: text })
                }}
                placeholder="• Requirement 1&#10;• Requirement 2&#10;• Requirement 3"
                className="mt-2"
              />
            </div>
          </TabsContent>

          <TabsContent value="code" className="space-y-4">
            <div>
              <Label htmlFor="playwright-code">Playwright Code</Label>
              <Textarea
                id="playwright-code"
                value={formData.playwrightCode}
                onChange={(e) => setFormData({ ...formData, playwrightCode: e.target.value })}
                placeholder="describe('Test Suite', () => {&#10;  it('should do something', async ({ page }) => {&#10;    // Test code here&#10;  });&#10;});"
                className="font-mono text-sm min-h-[300px]"
              />
            </div>
          </TabsContent>
        </Tabs>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!formData.name.trim()}>
            {isEditing ? "Update Test" : "Create Test"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
