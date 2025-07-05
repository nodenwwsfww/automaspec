'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Redo,
  Undo,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({
  content,
  onChange,
  placeholder,
  className,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-hidden min-h-[100px] p-3',
      },
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className={cn('rounded-md border', className)}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b p-2">
        <Button
          className={editor.isActive('bold') ? 'bg-muted' : ''}
          onClick={() => editor.chain().focus().toggleBold().run()}
          size="sm"
          variant="ghost"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          className={editor.isActive('italic') ? 'bg-muted' : ''}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          size="sm"
          variant="ghost"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <div className="mx-1 h-6 w-px bg-border" />
        <Button
          className={editor.isActive('bulletList') ? 'bg-muted' : ''}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          size="sm"
          variant="ghost"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          className={editor.isActive('orderedList') ? 'bg-muted' : ''}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          size="sm"
          variant="ghost"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          className={editor.isActive('blockquote') ? 'bg-muted' : ''}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          size="sm"
          variant="ghost"
        >
          <Quote className="h-4 w-4" />
        </Button>
        <div className="mx-1 h-6 w-px bg-border" />
        <Button
          disabled={!editor.can().undo()}
          onClick={() => editor.chain().focus().undo().run()}
          size="sm"
          variant="ghost"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          disabled={!editor.can().redo()}
          onClick={() => editor.chain().focus().redo().run()}
          size="sm"
          variant="ghost"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor */}
      <EditorContent
        className="min-h-[100px]"
        editor={editor}
        placeholder={placeholder}
      />
    </div>
  );
}
