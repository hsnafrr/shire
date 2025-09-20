import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Bold, Italic, List, Quote, Link, Image, Type } from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  "data-testid"?: string;
}

export default function RichTextEditor({ value, onChange, placeholder, "data-testid": testId }: RichTextEditorProps) {
  const [isPreview, setIsPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertText = (before: string, after: string = "", placeholder: string = "text") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const textToInsert = selectedText || placeholder;
    
    const newText = value.substring(0, start) + before + textToInsert + after + value.substring(end);
    onChange(newText);

    // Restore focus and selection
    setTimeout(() => {
      textarea.focus();
      const newStart = start + before.length;
      const newEnd = newStart + textToInsert.length;
      textarea.setSelectionRange(newStart, newEnd);
    }, 0);
  };

  const insertBold = () => insertText("**", "**", "bold text");
  const insertItalic = () => insertText("*", "*", "italic text");
  const insertHeading = () => insertText("## ", "", "heading");
  const insertQuote = () => insertText("> ", "", "quote");
  const insertLink = () => insertText("[", "](url)", "link text");
  const insertImage = () => insertText("![", "](image-url)", "alt text");
  const insertList = () => insertText("- ", "", "list item");

  const renderPreview = (text: string) => {
    // Simple markdown-like preview
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^## (.*$)/gm, '<h2 class="font-cinzel text-2xl font-bold text-primary mt-8 mb-4">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="font-cinzel text-xl font-bold text-primary mt-6 mb-3">$1</h3>')
      .replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-accent pl-6 my-4 italic text-lg text-muted-foreground">$1</blockquote>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-accent hover:text-primary underline">$1</a>')
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg" />')
      .replace(/^- (.*$)/gm, '<li class="ml-4">• $1</li>')
      .replace(/\n/g, '<br/>');
  };

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-background">
      {/* Editor Toolbar */}
      <div className="bg-muted px-4 py-2 border-b border-border">
        <div className="flex items-center space-x-2 flex-wrap gap-2">
          <Button 
            type="button" 
            variant="ghost" 
            size="sm"
            onClick={insertBold}
            className="p-2 hover:bg-background rounded transition-colors" 
            title="Bold"
            data-testid={testId ? `${testId}-bold` : "button-bold"}
          >
            <Bold className="w-4 h-4" />
          </Button>
          <Button 
            type="button" 
            variant="ghost" 
            size="sm"
            onClick={insertItalic}
            className="p-2 hover:bg-background rounded transition-colors" 
            title="Italic"
            data-testid={testId ? `${testId}-italic` : "button-italic"}
          >
            <Italic className="w-4 h-4" />
          </Button>
          <Button 
            type="button" 
            variant="ghost" 
            size="sm"
            onClick={insertHeading}
            className="p-2 hover:bg-background rounded transition-colors" 
            title="Heading"
            data-testid={testId ? `${testId}-heading` : "button-heading"}
          >
            <Type className="w-4 h-4" />
          </Button>
          <Button 
            type="button" 
            variant="ghost" 
            size="sm"
            onClick={insertQuote}
            className="p-2 hover:bg-background rounded transition-colors" 
            title="Quote"
            data-testid={testId ? `${testId}-quote` : "button-quote"}
          >
            <Quote className="w-4 h-4" />
          </Button>
          <Button 
            type="button" 
            variant="ghost" 
            size="sm"
            onClick={insertList}
            className="p-2 hover:bg-background rounded transition-colors" 
            title="List"
            data-testid={testId ? `${testId}-list` : "button-list"}
          >
            <List className="w-4 h-4" />
          </Button>
          <Button 
            type="button" 
            variant="ghost" 
            size="sm"
            onClick={insertLink}
            className="p-2 hover:bg-background rounded transition-colors" 
            title="Link"
            data-testid={testId ? `${testId}-link` : "button-link"}
          >
            <Link className="w-4 h-4" />
          </Button>
          <Button 
            type="button" 
            variant="ghost" 
            size="sm"
            onClick={insertImage}
            className="p-2 hover:bg-background rounded transition-colors" 
            title="Image"
            data-testid={testId ? `${testId}-image` : "button-image"}
          >
            <Image className="w-4 h-4" />
          </Button>
          
          <div className="flex-1"></div>
          
          <Button 
            type="button" 
            variant="ghost" 
            size="sm"
            onClick={() => setIsPreview(!isPreview)}
            className={`px-3 py-1 text-sm transition-colors ${
              isPreview ? 'bg-primary text-primary-foreground' : 'hover:bg-background'
            }`}
            data-testid={testId ? `${testId}-preview` : "button-preview"}
          >
            {isPreview ? "Edit" : "Preview"}
          </Button>
        </div>
      </div>
      
      {/* Editor Content */}
      <div className="min-h-[300px]">
        {isPreview ? (
          <div 
            className="p-4 prose prose-lg max-w-none text-foreground min-h-[300px]"
            dangerouslySetInnerHTML={{ __html: renderPreview(value) }}
            data-testid={testId ? `${testId}-preview-content` : "preview-content"}
          />
        ) : (
          <Textarea 
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || "Write your chronicle here... You can use Markdown formatting."}
            className="min-h-[300px] border-0 focus:ring-0 focus:ring-offset-0 resize-none font-mono text-sm leading-relaxed"
            data-testid={testId || "textarea-editor"}
          />
        )}
      </div>
      
      {/* Help Text */}
      <div className="px-4 py-2 bg-muted border-t border-border">
        <p className="text-xs text-muted-foreground">
          <span className="mr-4">📝 You can use Markdown formatting:</span>
          <span className="mr-4">**Bold**</span>
          <span className="mr-4">*Italic*</span>
          <span className="mr-4">## Headings</span>
          <span className="mr-4">[Link](url)</span>
          <span className="mr-4">![Image](url)</span>
        </p>
      </div>
    </div>
  );
}
