"use client"

import { useState } from "react"
import {
  ChevronRight,
  ChevronDown,
  AlertTriangle,
  Sparkles,
  Play,
  RotateCcw,
  FileText,
  Copy,
  Check,
  LogOut,
  User,
  Settings,
  Globe,
  MessageSquare,
  Loader2,
  Plus,
  Edit,
  MoreHorizontal,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { GroupEditorModal } from "./group-editor-modal"
import { TestEditorModal } from "./test-editor-modal"
import { RichTextEditor } from "./rich-text-editor"
import { cn } from "@/lib/utils"
import Link from "next/link"

// Mock database structure with more realistic test data
const testDatabase = {
  projects: [
    {
      id: "main-project",
      name: "E-commerce Platform",
      description: "Main e-commerce application testing suite",
      groups: [
        {
          id: "frontend-group",
          name: "Frontend Tests",
          type: "frontend",
          icon: Globe,
          passed: 143,
          total: 145,
          status: "healthy",
          description: "<p>Frontend user interface and interaction tests</p>",
          children: [
            {
              id: "auth-group",
              name: "Authentication",
              type: "feature",
              icon: User,
              passed: 49,
              total: 50,
              status: "warning",
              description: "<p>User authentication and authorization flows</p>",
              children: [
                {
                  id: "login-block",
                  name: "Login Block",
                  type: "component",
                  icon: MessageSquare,
                  passed: 9,
                  total: 9,
                  status: "passed",
                  framework: "Playwright",
                  description: "<p>Login form validation and authentication flow</p>",
                  requirements: [
                    "Отображается форма логина с полями email и password",
                    "При вводе валидных данных происходит успешная авторизация",
                    "При неверных данных показывается ошибка",
                    "Работает функция 'Запомнить меня'",
                  ],
                  playwrightCode: `describe('Authentication', () => {
    describe('Login Block', () => {
        it('should display login form correctly', async ({ page }) => {
            await page.goto('/login');
            await expect(page.locator('#email')).toBeVisible();
            await expect(page.locator('#password')).toBeVisible();
            await expect(page.locator('#login-btn')).toBeVisible();
        });

        it('should login with valid credentials', async ({ page }) => {
            await page.goto('/login');
            await page.fill('#email', 'user@example.com');
            await page.fill('#password', 'password123');
            await page.click('#login-btn');
            await expect(page.locator('.dashboard')).toBeVisible();
        });

        it('should show error for invalid credentials', async ({ page }) => {
            await page.goto('/login');
            await page.fill('#email', 'wrong@example.com');
            await page.fill('#password', 'wrongpass');
            await page.click('#login-btn');
            await expect(page.locator('.error-message')).toBeVisible();
        });
    });
});`,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}

function getStatusColor(status: any) {
  switch (status) {
    case "passed":
    case "healthy":
      return "text-green-600"
    case "warning":
      return "text-yellow-600"
    case "failed":
      return "text-red-600"
    default:
      return "text-gray-600"
  }
}

function getStatusBadge(status: any) {
  switch (status) {
    case "passed":
    case "healthy":
      return <Badge className="bg-green-100 text-green-800 border-green-200">Healthy</Badge>
    case "warning":
      return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Warning</Badge>
    case "failed":
      return <Badge className="bg-red-100 text-red-800 border-red-200">Failed</Badge>
    default:
      return <Badge variant="secondary">Unknown</Badge>
  }
}

function TreeNode({ node, level = 0, onSelect, selectedId, onEdit, onAddChild, onDelete }: any) {
  const [isExpanded, setIsExpanded] = useState(level < 3)
  const hasChildren = node.children && node.children.length > 0
  const isLeaf = !hasChildren
  const isSelected = selectedId === node.id

  const percentage = node.total ? Math.round((node.passed / node.total) * 100) : 100
  const hasFailures = node.total && node.passed < node.total
  const failureCount = node.total ? node.total - node.passed : 0

  const IconComponent = node.icon || FileText

  const handleClick = () => {
    if (hasChildren) {
      setIsExpanded(!isExpanded)
    }
    if (isLeaf) {
      onSelect(node)
    }
  }

  return (
    <div>
      <div
        className={cn(
          "group flex items-center gap-2 py-1 px-2 cursor-pointer hover:bg-muted/50 rounded-sm",
          isSelected && "bg-muted",
          level > 0 && "ml-4",
        )}
      >
        <div onClick={handleClick} className="flex items-center gap-2 flex-1">
          {hasChildren && (
            <div className="w-4 h-4 flex items-center justify-center">
              {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </div>
          )}
          {!hasChildren && <div className="w-4" />}

          <IconComponent className="w-4 h-4 text-muted-foreground" />

          <span className={cn("flex-1 text-sm", isLeaf && "font-medium")}>{node.name}</span>

          {hasFailures && (
            <div className="flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-orange-500" />
              <span className="text-xs text-orange-500">{failureCount}</span>
            </div>
          )}

          {node.total && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>
                {node.passed} / {node.total}
              </span>
              <span className={cn("font-medium", getStatusColor(node.status))}>{percentage}%</span>
            </div>
          )}
        </div>

        {/* Actions Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
            >
              <MoreHorizontal className="w-3 h-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(node)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAddChild(node)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Child
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(node)} className="text-red-600">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {hasChildren && isExpanded && (
        <div>
          {node.children.map((child: any) => (
            <TreeNode
              key={child.id}
              node={child}
              level={level + 1}
              onSelect={onSelect}
              selectedId={selectedId}
              onEdit={onEdit}
              onAddChild={onAddChild}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function TestDashboard() {
  const [selectedTest, setSelectedTest] = useState<any>(null)
  const [aiModalOpen, setAiModalOpen] = useState(false)
  const [groupEditorOpen, setGroupEditorOpen] = useState(false)
  const [testEditorOpen, setTestEditorOpen] = useState(false)
  const [editingGroup, setEditingGroup] = useState<any>(null)
  const [editingTest, setEditingTest] = useState<any>(null)
  const [parentGroup, setParentGroup] = useState<any>(null)
  const [aiPrompt, setAiPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [editingRequirements, setEditingRequirements] = useState(false)
  const [requirementsContent, setRequirementsContent] = useState("")

  const handleTestSelect = (test: any) => {
    setSelectedTest(test)
    setRequirementsContent(test.requirements?.join("\n") || "")
  }

  const handleEditGroup = (group: any) => {
    setEditingGroup(group)
    setParentGroup(null)
    setGroupEditorOpen(true)
  }

  const handleAddChild = (parentGroup: any) => {
    setEditingGroup(null)
    setParentGroup(parentGroup)
    setGroupEditorOpen(true)
  }

  const handleEditTest = (test: any) => {
    setEditingTest(test)
    setTestEditorOpen(true)
  }

  const handleDeleteGroup = (group: any) => {
    // In real app, would show confirmation dialog and delete from database
    console.log("Delete group:", group.name)
  }

  const handleSaveGroup = (group: any) => {
    // In real app, would save to database
    console.log("Save group:", group)
  }

  const handleSaveTest = (test: any) => {
    // In real app, would save to database
    console.log("Save test:", test)
  }

  const copyPlaywrightCode = async () => {
    if (selectedTest?.playwrightCode) {
      await navigator.clipboard.writeText(selectedTest.playwrightCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const generateTestWithAI = async () => {
    if (!aiPrompt.trim()) return

    setIsGenerating(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const generatedTest = {
      id: `generated-${Date.now()}`,
      name: "AI Generated Test",
      type: "component",
      icon: MessageSquare,
      passed: 0,
      total: 5,
      status: "not_run",
      framework: "Playwright",
      description: `<p>Generated test based on: "${aiPrompt}"</p>`,
      requirements: [
        "Автоматически сгенерированное требование 1",
        "Автоматически сгенерированное требование 2",
        "Автоматически сгенерированное требование 3",
      ],
      playwrightCode: `describe('AI Generated Test', () => {
    describe('Generated from prompt: ${aiPrompt}', () => {
        it('should meet generated requirements', async ({ page }) => {
            // Generated test code based on your prompt
            await page.goto('/');
            // Add more test steps here...
        });
    });
});`,
    }

    setIsGenerating(false)
    setAiModalOpen(false)
    setAiPrompt("")
    setSelectedTest(generatedTest)
  }

  const saveRequirements = () => {
    // In real app, would save to database
    if (selectedTest) {
      selectedTest.requirements = requirementsContent.split("\n").filter((req) => req.trim())
    }
    setEditingRequirements(false)
  }

  const allTests = testDatabase.projects[0]?.groups || []

  return (
    <div className="flex h-screen bg-background">
      {/* Left Panel - Tree Structure */}
      <div className="w-1/2 border-r flex flex-col">
        <div className="border-b p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold">Test Structure</h1>
            <Badge variant="secondary">Free Plan</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={() => setGroupEditorOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              New Group
            </Button>

            <Dialog open={aiModalOpen} onOpenChange={setAiModalOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate with AI
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Generate Test with AI</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="ai-prompt">Describe what you want to test</Label>
                    <Textarea
                      id="ai-prompt"
                      placeholder="e.g., 'Test user registration form with email validation and password confirmation'"
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setAiModalOpen(false)} disabled={isGenerating}>
                      Cancel
                    </Button>
                    <Button onClick={generateTestWithAI} disabled={isGenerating || !aiPrompt.trim()}>
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Generate Test
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <User className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-2">
          {(allTests as any[]).map((node: any) => (
            <TreeNode
              key={node.id}
              node={node}
              onSelect={handleTestSelect}
              selectedId={(selectedTest as any)?.id}
              onEdit={handleEditGroup}
              onAddChild={handleAddChild}
              onDelete={handleDeleteGroup}
            />
          ))}
        </div>
      </div>

      {/* Right Panel - Test Details */}
      <div className="w-1/2 flex flex-col">
        {selectedTest ? (
          <>
            <div className="border-b p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-xl font-semibold">{(selectedTest as any).name}</h2>
                    <Button variant="ghost" size="sm" onClick={() => handleEditTest(selectedTest)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                  <div
                    className="text-sm text-muted-foreground mb-2 prose prose-sm"
                    dangerouslySetInnerHTML={{ __html: (selectedTest as any).description }}
                  />
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{(selectedTest as any).framework}</Badge>
                    {getStatusBadge((selectedTest as any).status)}
                    <span className="text-sm text-muted-foreground">
                      Coverage:{" "}
                      <span className={cn("font-medium", getStatusColor((selectedTest as any).status))}>
                        {(selectedTest as any).total ? Math.round(((selectedTest as any).passed / (selectedTest as any).total) * 100) : 0}%
                      </span>{" "}
                      {(selectedTest as any).passed} of {(selectedTest as any).total}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm">
                    <Play className="w-4 h-4 mr-1" />
                    Run
                  </Button>
                  <Button size="sm" variant="outline">
                    <RotateCcw className="w-4 h-4 mr-1" />
                    Re-run
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-4">
              <Tabs defaultValue="requirements" className="h-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="requirements">Functional Requirements</TabsTrigger>
                  <TabsTrigger value="playwright">Playwright Code</TabsTrigger>
                </TabsList>

                <TabsContent value="requirements" className="mt-4 space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium">Test Requirements</h3>
                      <Button size="sm" variant="outline" onClick={() => setEditingRequirements(!editingRequirements)}>
                        <Edit className="w-4 h-4 mr-1" />
                        {editingRequirements ? "Cancel" : "Edit"}
                      </Button>
                    </div>

                    {editingRequirements ? (
                      <div className="space-y-4">
                        <RichTextEditor
                          content={requirementsContent
                            .split("\n")
                            .map((req) => `<p>${req}</p>`)
                            .join("")}
                          onChange={(content) => {
                            const div = document.createElement("div")
                            div.innerHTML = content
                            const text = div.textContent || div.innerText || ""
                            setRequirementsContent(text)
                          }}
                          placeholder="Enter test requirements..."
                        />
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setEditingRequirements(false)}>
                            Cancel
                          </Button>
                          <Button onClick={saveRequirements}>Save Requirements</Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {(selectedTest as any).requirements?.map((req: any, index: number) => (
                          <div key={index} className="flex items-start gap-2 p-3 bg-muted/30 rounded-lg">
                            <div
                              className={cn(
                                "w-2 h-2 rounded-full mt-2 flex-shrink-0",
                                (selectedTest as any).status === "passed"
                                  ? "bg-green-500"
                                  : (selectedTest as any).status === "failed"
                                    ? "bg-red-500"
                                    : "bg-gray-500",
                              )}
                            />
                            <p className="text-sm">{req}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="playwright" className="mt-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">Generated Playwright Code</h3>
                      <Button size="sm" onClick={copyPlaywrightCode}>
                        {copied ? (
                          <>
                            <Check className="w-4 h-4 mr-1" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 mr-1" />
                            Copy as Playwright
                          </>
                        )}
                      </Button>
                    </div>
                    <div className="bg-slate-950 text-slate-50 p-4 rounded-lg font-mono text-sm overflow-auto max-h-[500px]">
                      <pre className="whitespace-pre-wrap">{(selectedTest as any).playwrightCode}</pre>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Select a test from the tree to view details</p>
              <Button className="mt-4" onClick={() => setGroupEditorOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Group
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <GroupEditorModal
        open={groupEditorOpen}
        onOpenChange={setGroupEditorOpen}
        group={editingGroup}
        parentGroup={parentGroup}
        onSave={handleSaveGroup}
      />

      <TestEditorModal
        open={testEditorOpen}
        onOpenChange={setTestEditorOpen}
        test={editingTest}
        onSave={handleSaveTest}
      />
    </div>
  )
}
