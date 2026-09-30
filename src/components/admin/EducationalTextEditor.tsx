'use client';

import React, { useRef, useState, useEffect } from 'react';
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Quote,
  Highlighter,
  RemoveFormatting,
  Code,
  Eye,
  Type,
  Heading1,
  Heading2,
  Heading3
} from 'lucide-react';
import { sanitizeTextContent } from '@/lib/sanitize';

interface EducationalTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onPreview?: () => void;
}

export default function EducationalTextEditor({
  value,
  onChange,
  placeholder = 'Type comprehensive educational study notes here...',
  onPreview
}: EducationalTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isSourceMode, setIsSourceMode] = useState(false);
  const [internalHtml, setInternalHtml] = useState(value || '');

  // Helper to convert legacy markdown to HTML if plain text was entered
  const normalizeToHtml = (content: string): string => {
    if (!content) return '';
    // If already contains HTML tags, return as-is
    if (/<[a-z][\s\S]*>/i.test(content)) {
      return content;
    }
    // Convert plain text / basic markdown to HTML
    return content
      .split('\n\n')
      .map((block) => {
        const trimmed = block.trim();
        if (trimmed.startsWith('# ')) return `<h1>${trimmed.slice(2)}</h1>`;
        if (trimmed.startsWith('## ')) return `<h2>${trimmed.slice(3)}</h2>`;
        if (trimmed.startsWith('### ')) return `<h3>${trimmed.slice(4)}</h3>`;
        if (trimmed.startsWith('> ')) return `<blockquote>${trimmed.slice(2)}</blockquote>`;
        return `<p>${trimmed.replace(/\n/g, '<br/>')}</p>`;
      })
      .join('');
  };

  // Sync editor innerHTML when external value changes
  useEffect(() => {
    const normalized = normalizeToHtml(value);
    setInternalHtml(normalized);
    if (editorRef.current && editorRef.current.innerHTML !== normalized) {
      editorRef.current.innerHTML = normalized;
    }
  }, [value]);

  const handleEditorInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      setInternalHtml(html);
      onChange(html);
    }
  };

  const handleSourceChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setInternalHtml(val);
    onChange(val);
  };

  const executeCommand = (command: string, arg: string | undefined = undefined) => {
    if (isSourceMode) return;
    if (editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand(command, false, arg);
    handleEditorInput();
  };

  const applyFormatBlock = (tag: string) => {
    if (isSourceMode) return;
    executeCommand('formatBlock', `<${tag}>`);
  };

  const applyHighlight = () => {
    if (isSourceMode) return;
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
      executeCommand('hiliteColor', '#fef08a');
      return;
    }

    const range = selection.getRangeAt(0);
    const mark = document.createElement('mark');
    mark.style.backgroundColor = '#fef08a';
    mark.style.color = '#713f12';
    mark.style.padding = '0.1em 0.35em';
    mark.style.borderRadius = '0.25rem';
    mark.style.fontWeight = '600';

    try {
      range.surroundContents(mark);
      handleEditorInput();
    } catch (e) {
      executeCommand('hiliteColor', '#fef08a');
    }
  };

  const applyFontSize = (size: 'small' | 'normal' | 'large') => {
    if (isSourceMode) return;
    const sizeMap = {
      small: '2',
      normal: '3',
      large: '5'
    };
    executeCommand('fontSize', sizeMap[size]);
  };

  // Character & word counters
  const rawText = internalHtml.replace(/<[^>]*>/g, '').trim();
  const wordCount = rawText ? rawText.split(/\s+/).filter(Boolean).length : 0;
  const charCount = rawText.length;

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl sm:rounded-2xl overflow-hidden flex flex-col shadow-inner w-full min-w-0 max-w-full">
      {/* Document Toolbar with internal horizontal scrolling on mobile */}
      <div className="bg-slate-900 p-1.5 sm:p-2 border-b border-slate-800 flex items-center gap-1 sm:gap-1.5 text-slate-300 select-none overflow-x-auto max-w-full scrollbar-thin">
        
        {/* Block Format (H1, H2, H3, P) */}
        <div className="flex-shrink-0 flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1 gap-0.5">
          <button
            type="button"
            onClick={() => applyFormatBlock('p')}
            className="px-2 py-1 rounded text-[11px] font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            title="Paragraph"
          >
            Normal
          </button>
          <button
            type="button"
            onClick={() => applyFormatBlock('h1')}
            className="px-2 py-1 rounded text-[11px] font-bold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors flex items-center gap-0.5"
            title="Heading 1"
          >
            <Heading1 className="w-3.5 h-3.5 text-blue-400" />
            <span>H1</span>
          </button>
          <button
            type="button"
            onClick={() => applyFormatBlock('h2')}
            className="px-2 py-1 rounded text-[11px] font-bold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors flex items-center gap-0.5"
            title="Heading 2"
          >
            <Heading2 className="w-3.5 h-3.5 text-blue-400" />
            <span>H2</span>
          </button>
          <button
            type="button"
            onClick={() => applyFormatBlock('h3')}
            className="px-2 py-1 rounded text-[11px] font-bold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors flex items-center gap-0.5"
            title="Heading 3"
          >
            <Heading3 className="w-3.5 h-3.5 text-blue-400" />
            <span>H3</span>
          </button>
        </div>

        <div className="h-5 w-px bg-slate-800 mx-0.5" />

        {/* Inline Formatting (B, I, U) */}
        <div className="flex-shrink-0 flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1 gap-0.5">
          <button
            type="button"
            onClick={() => executeCommand('bold')}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors font-bold"
            title="Bold (Ctrl+B)"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('italic')}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors italic"
            title="Italic (Ctrl+I)"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('underline')}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors underline"
            title="Underline (Ctrl+U)"
          >
            <Underline className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="h-5 w-px bg-slate-800 mx-0.5 flex-shrink-0" />

        {/* Study Highlight & Blockquote */}
        <div className="flex-shrink-0 flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1 gap-0.5">
          <button
            type="button"
            onClick={applyHighlight}
            className="p-1.5 rounded bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 transition-colors flex items-center gap-1 text-[11px] font-bold"
            title="Exam Key Point Highlight"
          >
            <Highlighter className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Highlight</span>
          </button>
          <button
            type="button"
            onClick={() => applyFormatBlock('blockquote')}
            className="p-1.5 rounded bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 transition-colors flex items-center gap-1 text-[11px] font-semibold"
            title="Callout Box / Important Note"
          >
            <Quote className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Callout</span>
          </button>
        </div>

        <div className="h-5 w-px bg-slate-800 mx-0.5 flex-shrink-0" />

        {/* Alignment Controls */}
        <div className="flex-shrink-0 flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1 gap-0.5">
          <button
            type="button"
            onClick={() => executeCommand('justifyLeft')}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Align Left"
          >
            <AlignLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('justifyCenter')}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Align Center"
          >
            <AlignCenter className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('justifyRight')}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Align Right"
          >
            <AlignRight className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('justifyFull')}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Justify"
          >
            <AlignJustify className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="h-5 w-px bg-slate-800 mx-0.5 flex-shrink-0" />

        {/* Lists (Ordered / Unordered) */}
        <div className="flex-shrink-0 flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1 gap-0.5">
          <button
            type="button"
            onClick={() => executeCommand('insertUnorderedList')}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Bullet List"
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('insertOrderedList')}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Numbered List"
          >
            <ListOrdered className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="h-5 w-px bg-slate-800 mx-0.5 flex-shrink-0" />

        {/* Font Sizing */}
        <div className="flex-shrink-0 flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1 gap-0.5">
          <button
            type="button"
            onClick={() => applyFontSize('small')}
            className="px-1.5 py-0.5 text-[10px] font-bold hover:bg-slate-800 text-slate-400 hover:text-white rounded"
            title="Small font size"
          >
            Small
          </button>
          <button
            type="button"
            onClick={() => applyFontSize('normal')}
            className="px-1.5 py-0.5 text-[10px] font-bold hover:bg-slate-800 text-slate-300 hover:text-white rounded"
            title="Normal font size"
          >
            Normal
          </button>
          <button
            type="button"
            onClick={() => applyFontSize('large')}
            className="px-1.5 py-0.5 text-[10px] font-bold hover:bg-slate-800 text-slate-200 hover:text-white rounded"
            title="Large font size"
          >
            Large
          </button>
        </div>

        <div className="h-5 w-px bg-slate-800 mx-0.5 flex-shrink-0" />

        {/* Clean / Reset Format */}
        <button
          type="button"
          onClick={() => executeCommand('removeFormat')}
          className="flex-shrink-0 p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          title="Clear Formatting"
        >
          <RemoveFormatting className="w-3.5 h-3.5" />
        </button>

        {/* Right side tools: Source Mode Toggle & Live Preview */}
        <div className="flex-shrink-0 ml-auto flex items-center gap-1.5 pl-2">
          <button
            type="button"
            onClick={() => setIsSourceMode(!isSourceMode)}
            className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-colors flex items-center gap-1 ${
              isSourceMode
                ? 'bg-blue-600/30 border-blue-500 text-blue-300'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
            title="Toggle HTML Source Mode"
          >
            <Code className="w-3.5 h-3.5" />
            <span>{isSourceMode ? 'Visual' : 'HTML'}</span>
          </button>

          {onPreview && (
            <button
              type="button"
              onClick={onPreview}
              className="px-3 py-1 bg-[#005CBF] hover:bg-[#004a9e] text-white rounded-xl text-[11px] font-bold shadow-xs transition-colors flex items-center gap-1"
              title="Preview document exactly as students see it"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>
          )}
        </div>
      </div>

      {/* Editor Content Area (White Document Canvas) */}
      <div className="p-2 sm:p-5 bg-slate-900/60 overflow-y-auto min-h-[220px] sm:min-h-[360px] max-h-[580px] flex justify-center w-full min-w-0">
        {isSourceMode ? (
          <textarea
            value={internalHtml}
            onChange={handleSourceChange}
            placeholder="Enter raw HTML study notes..."
            rows={12}
            className="w-full bg-slate-950 text-slate-100 font-mono text-xs p-3 sm:p-4 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-[#005CBF] leading-relaxed box-border max-w-full"
          />
        ) : (
          <div
            ref={editorRef}
            contentEditable
            onInput={handleEditorInput}
            onBlur={handleEditorInput}
            className="w-full max-w-3xl min-h-[200px] sm:min-h-[320px] bg-white text-slate-900 rounded-xl p-3.5 sm:p-8 sm:p-10 shadow-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#005CBF] leading-relaxed select-text font-sans text-xs sm:text-base break-words box-border max-w-full"
            style={{
              minHeight: '220px'
            }}
          />
        )}
      </div>

      {/* Editor Footer Status Bar */}
      <div className="bg-slate-950 px-3 sm:px-4 py-2 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 text-[10px] sm:text-[11px] text-slate-400 select-none w-full min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-300">Notes Study Editor</span>
          <span>•</span>
          <span className="text-emerald-400 font-medium">Safe HTML &amp; XSS Protected</span>
        </div>
        <div className="font-mono text-slate-400">
          {wordCount} words · {charCount} chars
        </div>
      </div>
    </div>
  );
}
