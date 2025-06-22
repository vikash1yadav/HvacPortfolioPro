import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const [isPreview, setIsPreview] = useState(false);

  const insertText = useCallback((before: string, after: string = "") => {
    const textarea = document.querySelector('textarea[data-rich-text]') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
    
    onChange(newText);
    
    // Set cursor position after the inserted text
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
    }, 0);
  }, [value, onChange]);

  const formatText = useCallback((format: string) => {
    switch (format) {
      case 'bold':
        insertText('**', '**');
        break;
      case 'italic':
        insertText('*', '*');
        break;
      case 'heading1':
        insertText('# ');
        break;
      case 'heading2':
        insertText('## ');
        break;
      case 'heading3':
        insertText('### ');
        break;
      case 'link':
        insertText('[', '](url)');
        break;
      case 'image':
        insertText('![alt text](', ')');
        break;
      case 'quote':
        insertText('> ');
        break;
      case 'code':
        insertText('`', '`');
        break;
      case 'codeblock':
        insertText('```\n', '\n```');
        break;
      case 'list':
        insertText('- ');
        break;
      case 'numberlist':
        insertText('1. ');
        break;
    }
  }, [insertText]);

  const renderPreview = (text: string) => {
    // Simple markdown-to-HTML conversion for preview
    let html = text
      .replace(/### (.*)/g, '<h3>$1</h3>')
      .replace(/## (.*)/g, '<h2>$1</h2>')
      .replace(/# (.*)/g, '<h1>$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/> (.*)/g, '<blockquote>$1</blockquote>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width: 100%; height: auto;" />')
      .replace(/^- (.*)$/gm, '<li>$1</li>')
      .replace(/^(\d+)\. (.*)$/gm, '<li>$1. $2</li>')
      .replace(/\n/g, '<br />');

    // Wrap list items
    html = html.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');
    
    return html;
  };

  return (
    <Card className="border rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="border-b p-2 flex flex-wrap gap-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatText('bold')}
          title="Bold"
        >
          <i className="fas fa-bold"></i>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatText('italic')}
          title="Italic"
        >
          <i className="fas fa-italic"></i>
        </Button>
        <div className="border-l mx-1"></div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatText('heading1')}
          title="Heading 1"
        >
          H1
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatText('heading2')}
          title="Heading 2"
        >
          H2
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatText('heading3')}
          title="Heading 3"
        >
          H3
        </Button>
        <div className="border-l mx-1"></div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatText('link')}
          title="Link"
        >
          <i className="fas fa-link"></i>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatText('image')}
          title="Image"
        >
          <i className="fas fa-image"></i>
        </Button>
        <div className="border-l mx-1"></div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatText('list')}
          title="Bullet List"
        >
          <i className="fas fa-list-ul"></i>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatText('numberlist')}
          title="Numbered List"
        >
          <i className="fas fa-list-ol"></i>
        </Button>
        <div className="border-l mx-1"></div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatText('quote')}
          title="Quote"
        >
          <i className="fas fa-quote-left"></i>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatText('code')}
          title="Inline Code"
        >
          <i className="fas fa-code"></i>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatText('codeblock')}
          title="Code Block"
        >
          <i className="fas fa-file-code"></i>
        </Button>
        <div className="border-l mx-1 ml-auto"></div>
        <Button
          type="button"
          variant={isPreview ? "default" : "ghost"}
          size="sm"
          onClick={() => setIsPreview(!isPreview)}
          title="Toggle Preview"
        >
          <i className="fas fa-eye"></i>
        </Button>
      </div>

      {/* Editor/Preview */}
      <div className="min-h-[300px]">
        {isPreview ? (
          <div 
            className="p-4 prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: renderPreview(value) }}
          />
        ) : (
          <Textarea
            data-rich-text
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || "Start writing..."}
            className="min-h-[300px] border-0 rounded-none resize-none focus-visible:ring-0"
          />
        )}
      </div>

      {/* Help Text */}
      <div className="border-t p-2 text-xs text-gray-500">
        <p>
          <strong>Markdown supported:</strong> **bold**, *italic*, # heading, [link](url), ![image](url), `code`, {'>'} quote
        </p>
      </div>
    </Card>
  );
}
