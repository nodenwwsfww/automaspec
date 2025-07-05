'use client';

import {
  AlertTriangle,
  Check,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Clock,
  Copy,
  Edit,
  FileText,
  Folder,
  Globe,
  Loader2,
  LogOut,
  MessageSquare,
  MinusCircle,
  MoreHorizontal,
  Plus,
  RotateCcw,
  Settings,
  Sparkles,
  Trash2,
  User,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { GroupEditorModal } from './group-editor-modal';
import { RichTextEditor } from './rich-text-editor';
import { TestEditorModal } from './test-editor-modal';

// Mock database structure with simplified test data
const testDatabase = {
  projects: [
    {
      id: 'main-project',
      name: 'E-commerce Platform',
      description: 'Main e-commerce application testing suite',
      groups: [
        {
          id: 'frontend-group',
          name: 'Frontend Tests',
          type: 'group',
          icon: Folder,
          passed: 143,
          total: 145,
          status: 'healthy',
          description: 'Frontend user interface and interaction tests',
          children: [
            {
              id: 'auth-group',
              name: 'Authentication',
              type: 'group',
              icon: Folder,
              passed: 49,
              total: 50,
              status: 'warning',
              description: 'User authentication and authorization flows',
              children: [
                {
                  id: 'login-test',
                  name: 'Login Test',
                  type: 'test',
                  icon: FileText,
                  passed: 9,
                  total: 9,
                  status: 'passed',
                  framework: 'Playwright',
                  description: 'Login form validation and authentication flow',
                  requirements: [
                    {
                      id: 'req-1',
                      text: 'Отображается форма логина с полями email и password',
                      status: 'passed',
                    },
                    {
                      id: 'req-2',
                      text: 'При вводе валидных данных происходит успешная авторизация',
                      status: 'passed',
                    },
                    {
                      id: 'req-3',
                      text: 'При неверных данных показывается ошибка',
                      status: 'passed',
                    },
                    {
                      id: 'req-4',
                      text: "Работает функция 'Запомнить меня'",
                      status: 'failed',
                    },
                  ],
                  playwrightCode: `describe('Authentication', () => {
    describe('Login Test', () => {
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
};

function getStatusColor(status: any) {
  switch (status) {
    case 'passed':
    case 'healthy':
      return 'text-green-600';
    case 'warning':
      return 'text-yellow-600';
    case 'failed':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
}

function getStatusBadge(status: any) {
  switch (status) {
    case 'passed':
    case 'healthy':
      return (
        <Badge className="border-green-200 bg-green-100 text-green-800">
          Healthy
        </Badge>
      );
    case 'warning':
      return (
        <Badge className="border-yellow-200 bg-yellow-100 text-yellow-800">
          Warning
        </Badge>
      );
    case 'failed':
      return (
        <Badge className="border-red-200 bg-red-100 text-red-800">Failed</Badge>
      );
    default:
      return <Badge variant="secondary">Unknown</Badge>;
  }
}

function getRequirementStatusIcon(status: string) {
  switch (status) {
    case 'passed':
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case 'failed':
      return <XCircle className="h-4 w-4 text-red-600" />;
    case 'skipped':
      return <MinusCircle className="h-4 w-4 text-gray-400" />;
    case 'pending':
      return <Clock className="h-4 w-4 text-yellow-600" />;
    default:
      return <MinusCircle className="h-4 w-4 text-gray-400" />;
  }
}

function getRequirementStatusColor(status: string) {
  switch (status) {
    case 'passed':
      return 'text-green-800 bg-green-50';
    case 'failed':
      return 'text-red-800 bg-red-50';
    case 'skipped':
      return 'text-gray-600 bg-gray-50';
    case 'pending':
      return 'text-yellow-800 bg-yellow-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
}

function TreeNode({
  node,
  level = 0,
  onSelect,
  selectedId,
  onEdit,
  onAddChild,
  onDelete,
}: any) {
  const [isExpanded, setIsExpanded] = useState(level < 3);
  const hasChildren = node.children && node.children.length > 0;
  const isLeaf = !hasChildren;
  const isSelected = selectedId === node.id;

  const percentage = node.total
    ? Math.round((node.passed / node.total) * 100)
    : 100;
  const hasFailures = node.total && node.passed < node.total;
  const failureCount = node.total ? node.total - node.passed : 0;

  const IconComponent = node.icon || FileText;

  const handleClick = () => {
    if (hasChildren) {
      setIsExpanded(!isExpanded);
    }
    // Only allow selecting test items (not groups)
    if (node.type === 'test') {
      onSelect(node);
    }
  };

  return (
    <div>
      <div
        className={cn(
          'group flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1 hover:bg-muted/50',
          isSelected && 'bg-muted',
          level > 0 && 'ml-4'
        )}
      >
        <div className="flex flex-1 items-center gap-2" onClick={handleClick}>
          {hasChildren && (
            <div className="flex h-4 w-4 items-center justify-center">
              {isExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </div>
          )}
          {!hasChildren && <div className="w-4" />}

          <IconComponent className="h-4 w-4 text-muted-foreground" />

          <span className={cn('flex-1 text-sm', isLeaf && 'font-medium')}>
            {node.name}
          </span>

          {hasFailures && (
            <div className="flex items-center gap-1">
              <AlertTriangle className="h-3 w-3 text-orange-500" />
              <span className="text-orange-500 text-xs">{failureCount}</span>
            </div>
          )}

          {node.total && (
            <div className="flex items-center gap-2 text-muted-foreground text-xs">
              <span>
                {node.passed} / {node.total}
              </span>
              <span className={cn('font-medium', getStatusColor(node.status))}>
                {percentage}%
              </span>
            </div>
          )}
        </div>

        {/* Actions Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="h-6 w-6 p-0 opacity-0 transition-opacity group-hover:opacity-100"
              size="sm"
              variant="ghost"
            >
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(node)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            {node.type === 'group' && (
              <>
                <DropdownMenuItem onClick={() => onAddChild({ ...node, type: 'group' })}>
                  <Folder className="mr-2 h-4 w-4" />
                  Add Group
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onAddChild({ ...node, type: 'test' })}>
                  <FileText className="mr-2 h-4 w-4" />
                  Add Test
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuItem
              className="text-red-600"
              onClick={() => onDelete(node)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
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
              level={level + 1}
              node={child}
              onAddChild={onAddChild}
              onDelete={onDelete}
              onEdit={onEdit}
              onSelect={onSelect}
              selectedId={selectedId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function Dashboard() {
  const [selectedTest, setSelectedTest] = useState<any>(null);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [groupEditorOpen, setGroupEditorOpen] = useState(false);
  const [testEditorOpen, setTestEditorOpen] = useState(false);
  const [groups, setGroups] = useState<any[]>(testDatabase.projects[0]?.groups || []);
  const [editingGroup, setEditingGroup] = useState<any>(null);
  const [editingTest, setEditingTest] = useState<any>(null);
  const [parentGroup, setParentGroup] = useState<any>(null);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [editingRequirements, setEditingRequirements] = useState(false);
  const [requirementsContent, setRequirementsContent] = useState('');

  const handleTestSelect = (test: any) => {
    setSelectedTest(test);
    setRequirementsContent(
      test.requirements?.map((req: any) => req.text || req).join('\n') || ''
    );
  };

  const handleEditGroup = (group: any) => {
    setEditingGroup(group);
    setParentGroup(null);
    setGroupEditorOpen(true);
  };

  const handleAddChild = (parentGroup: any) => {
    setEditingGroup({ type: parentGroup.type });
    setParentGroup(parentGroup);
    setGroupEditorOpen(true);
  };

  const handleEditTest = (test: any) => {
    setEditingTest(test);
    setTestEditorOpen(true);
  };

  const handleDeleteGroup = (_group: any) => {};

  const handleSaveGroup = (item: any) => {
    const replaceNode = (nodes: any[]): any[] =>
      nodes.map((n) =>
        n.id === item.id
          ? { ...item }
          : { ...n, children: n.children ? replaceNode(n.children) : n.children }
      );

    let updated: any[] = groups;

    if (groups.some((n) => n.id === item.id)) {
      // editing root-level item
      updated = replaceNode(groups);
    } else if (editingGroup && editingGroup.id) {
      // editing nested item
      updated = replaceNode(groups);
    } else {
      if (parentGroup) {
        // add new item under parent
        const addChild = (nodes: any[]): any[] =>
          nodes.map((n) =>
            n.id === parentGroup.id
              ? { ...n, children: [...(n.children || []), item] }
              : { ...n, children: n.children ? addChild(n.children) : n.children }
          );
        updated = addChild(groups);
      } else {
        // add to root
        updated = [...groups, item];
      }
    }

    setGroups(updated);
    setEditingGroup(null);
    setParentGroup(null);
  };

  const handleSaveTest = (_test: any) => {};

  const copyPlaywrightCode = async () => {
    if (selectedTest?.playwrightCode) {
      await navigator.clipboard.writeText(selectedTest.playwrightCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const generateTestWithAI = async () => {
    if (!aiPrompt.trim()) {
      return;
    }

    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const generatedTest = {
      id: `generated-${Date.now()}`,
      name: 'AI Generated Test',
      type: 'test',
      icon: FileText,
      passed: 0,
      total: 3,
      status: 'pending',
      framework: 'Playwright',
      description: `Generated test based on: "${aiPrompt}"`,
      requirements: [
        {
          id: 'gen-req-1',
          text: 'Автоматически сгенерированное требование 1',
          status: 'pending',
        },
        {
          id: 'gen-req-2',
          text: 'Автоматически сгенерированное требование 2',
          status: 'pending',
        },
        {
          id: 'gen-req-3',
          text: 'Автоматически сгенерированное требование 3',
          status: 'pending',
        },
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
    };

    setIsGenerating(false);
    setAiModalOpen(false);
    setAiPrompt('');
    setSelectedTest(generatedTest);
  };

  const saveRequirements = () => {
    // In real app, would save to database
    if (selectedTest) {
      selectedTest.requirements = requirementsContent
        .split('\n')
        .filter((req) => req.trim())
        .map((req: string, index: number) => ({
          id: `req-${index + 1}`,
          text: req,
          status: 'pending',
        }));
    }
    setEditingRequirements(false);
  };

  const allTests = groups;

  return (
    <div className="flex h-screen bg-background">
      {/* Left Panel - Tree Structure */}
      <div className="flex w-1/2 flex-col border-r">
        <div className="flex items-center justify-between border-b p-4">
          <div className="flex items-center gap-4">
            <h1 className="font-semibold text-lg">Test Structure</h1>
            <Badge variant="secondary">Free Plan</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => {
              setEditingGroup({ type: 'group' });
              setParentGroup(null);
              setGroupEditorOpen(true);
            }} size="sm" variant="outline">
              <Folder className="mr-2 h-4 w-4" />
              New Group
            </Button>
            
            <Button onClick={() => {
              setEditingGroup({ type: 'test' });
              setParentGroup(null);
              setGroupEditorOpen(true);
            }} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              New Test
            </Button>

            <Dialog onOpenChange={setAiModalOpen} open={aiModalOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                  <Sparkles className="mr-2 h-4 w-4" />
                  AI Generate
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Generate Test with AI</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="ai-prompt">
                      Describe what you want to test
                    </Label>
                    <Textarea
                      className="min-h-[100px]"
                      id="ai-prompt"
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="e.g., 'Test user registration form with email validation and password confirmation'"
                      value={aiPrompt}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      disabled={isGenerating}
                      onClick={() => setAiModalOpen(false)}
                      variant="outline"
                    >
                      Cancel
                    </Button>
                    <Button
                      disabled={isGenerating || !aiPrompt.trim()}
                      onClick={generateTestWithAI}
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
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
                <Button size="sm" variant="ghost">
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/">
                    <LogOut className="mr-2 h-4 w-4" />
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
              onAddChild={handleAddChild}
              onDelete={handleDeleteGroup}
              onEdit={handleEditGroup}
              onSelect={handleTestSelect}
              selectedId={(selectedTest as any)?.id}
            />
          ))}
        </div>
      </div>

      {/* Right Panel - Test Details */}
      <div className="flex w-1/2 flex-col">
        {selectedTest ? (
          <>
            <div className="border-b p-4">
              <div className="mb-2 flex items-start justify-between">
                <div>
                  <div className="mb-1 flex items-center gap-2">
                    <h2 className="font-semibold text-xl">
                      {(selectedTest as any).name}
                    </h2>
                    <Button
                      onClick={() => handleEditTest(selectedTest)}
                      size="sm"
                      variant="ghost"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="mb-2 text-muted-foreground text-sm">
                    {(selectedTest as any).description}
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {(selectedTest as any).framework}
                    </Badge>
                    {getStatusBadge((selectedTest as any).status)}
                    <span className="text-muted-foreground text-sm">
                      Coverage:{' '}
                      <span
                        className={cn(
                          'font-medium',
                          getStatusColor((selectedTest as any).status)
                        )}
                      >
                        {(selectedTest as any).total
                          ? Math.round(
                              ((selectedTest as any).passed /
                                (selectedTest as any).total) *
                                100
                            )
                          : 0}
                        %
                      </span>{' '}
                      {(selectedTest as any).passed} of{' '}
                      {(selectedTest as any).total}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <RotateCcw className="mr-1 h-4 w-4" />
                    Re-run
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-4">
              <Tabs className="h-full" defaultValue="requirements">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="requirements">
                    Functional Requirements
                  </TabsTrigger>
                  <TabsTrigger value="playwright">Playwright Code</TabsTrigger>
                </TabsList>

                <TabsContent className="mt-4 space-y-4" value="requirements">
                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="font-medium">Test Requirements</h3>
                      <Button
                        onClick={() =>
                          setEditingRequirements(!editingRequirements)
                        }
                        size="sm"
                        variant="outline"
                      >
                        <Edit className="mr-1 h-4 w-4" />
                        {editingRequirements ? 'Cancel' : 'Edit'}
                      </Button>
                    </div>

                    {((selectedTest as any).requirements || []).length > 0 && (
                      <div className="mb-4 rounded-lg bg-muted/30 p-3">
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="font-medium">
                              {
                                (
                                  (selectedTest as any).requirements || []
                                ).filter((req: any) => req.status === 'passed')
                                  .length
                              }{' '}
                              Passed
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <XCircle className="h-4 w-4 text-red-600" />
                            <span className="font-medium">
                              {
                                (
                                  (selectedTest as any).requirements || []
                                ).filter((req: any) => req.status === 'failed')
                                  .length
                              }{' '}
                              Failed
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-yellow-600" />
                            <span className="font-medium">
                              {
                                (
                                  (selectedTest as any).requirements || []
                                ).filter((req: any) => req.status === 'pending')
                                  .length
                              }{' '}
                              Pending
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {editingRequirements ? (
                      <div className="space-y-2">
                        <Textarea
                          className="min-h-[200px]"
                          onChange={(e) =>
                            setRequirementsContent(e.target.value)
                          }
                          placeholder="Enter requirements, one per line"
                          value={requirementsContent}
                        />
                        <div className="flex justify-end gap-2">
                          <Button
                            onClick={() => setEditingRequirements(false)}
                            variant="outline"
                          >
                            Cancel
                          </Button>
                          <Button onClick={saveRequirements}>
                            Save Requirements
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {((selectedTest as any).requirements || []).map(
                          (req: any, index: number) => (
                            <div
                              className={cn(
                                'flex items-start gap-3 rounded-lg border p-3',
                                getRequirementStatusColor(
                                  req.status || 'pending'
                                )
                              )}
                              key={req.id || index}
                            >
                              <div className="mt-0.5">
                                {getRequirementStatusIcon(
                                  req.status || 'pending'
                                )}
                              </div>
                              <div className="flex-1">
                                <span className="font-medium text-sm">
                                  {req.text || req}
                                </span>
                                <div className="mt-1 text-muted-foreground text-xs">
                                  Status:{' '}
                                  <span className="capitalize">
                                    {req.status || 'pending'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )
                        )}
                        {((selectedTest as any).requirements || []).length ===
                          0 && (
                          <div className="text-muted-foreground text-sm">
                            No requirements defined
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent className="mt-4" value="playwright">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">Generated Playwright Code</h3>
                      <Button onClick={copyPlaywrightCode} size="sm">
                        {copied ? (
                          <>
                            <Check className="mr-1 h-4 w-4" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="mr-1 h-4 w-4" />
                            Copy as Playwright
                          </>
                        )}
                      </Button>
                    </div>
                    <div className="max-h-[500px] overflow-auto rounded-lg bg-slate-950 p-4 font-mono text-slate-50 text-sm">
                      <pre className="whitespace-pre-wrap">
                        {(selectedTest as any).playwrightCode}
                      </pre>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center text-muted-foreground">
            <div className="text-center">
              <FileText className="mx-auto mb-4 h-12 w-12 opacity-50" />
              <p>Select a test to view details and code</p>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" onClick={() => {
                  setEditingGroup({ type: 'group' });
                  setParentGroup(null);
                  setGroupEditorOpen(true);
                }}>
                  <Folder className="mr-2 h-4 w-4" />
                  Create Group
                </Button>
                <Button onClick={() => {
                  setEditingGroup({ type: 'test' });
                  setParentGroup(null);
                  setGroupEditorOpen(true);
                }}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Test
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <GroupEditorModal
        group={editingGroup}
        onOpenChange={setGroupEditorOpen}
        onSave={handleSaveGroup}
        open={groupEditorOpen}
        parentGroup={parentGroup}
      />

      <TestEditorModal
        onOpenChange={setTestEditorOpen}
        onSave={handleSaveTest}
        open={testEditorOpen}
        test={editingTest}
      />
    </div>
  );
}
