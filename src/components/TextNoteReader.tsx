'use client';

import React, { useState, useEffect } from 'react';
import { Note } from '@/types';
import {
  BookOpen,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  ShieldCheck,
  Type,
  Lock,
  AlertCircle
} from 'lucide-react';
import { sanitizeTextContent } from '@/lib/sanitize';

interface TextNoteReaderProps {
  note: Note;
}

export default function TextNoteReader({ note }: TextNoteReaderProps) {
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg' | 'xl'>('base');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copyWarning, setCopyWarning] = useState(false);

  // Client-side text copy protection: Prevent copy, print, cut, and key shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent Ctrl+C or Cmd+C
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        triggerCopyWarning();
      }
      // Prevent Ctrl+P or Cmd+P (Print)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        triggerCopyWarning();
      }
      // Prevent Ctrl+S or Cmd+S (Save)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        triggerCopyWarning();
      }
      // Prevent Ctrl+U (View Source)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'u') {
        e.preventDefault();
      }
    };

    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      triggerCopyWarning();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('copy', handleCopy);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('copy', handleCopy);
    };
  }, []);

  const triggerCopyWarning = () => {
    setCopyWarning(true);
    setTimeout(() => setCopyWarning(false), 3000);
  };

  const toggleFullscreen = () => {
    const element = document.getElementById('text-reader-container');
    if (!element) return;

    if (!document.fullscreenElement) {
      element.requestFullscreen().then(() => setIsFullscreen(true)).catch((err) => console.error(err));
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch((err) => console.error(err));
    }
  };

  const fontSizeClasses = {
    sm: 'text-sm leading-relaxed',
    base: 'text-base leading-relaxed',
    lg: 'text-lg leading-loose',
    xl: 'text-xl leading-loose'
  }[fontSize];

  // Parse structured markdown / educational content into beautiful document layout
  const renderDocumentContent = (rawText: string) => {
    if (!rawText) {
      return (
        <div className="py-12 text-center text-slate-400 italic">
          No document content available for this note.
        </div>
      );
    }

    const sanitized = sanitizeTextContent(rawText);
    const lines = sanitized.split('\n');
    const elements: React.ReactNode[] = [];
    let currentList: { type: 'ul' | 'ol'; items: string[] } | null = null;

    const flushList = (key: number) => {
      if (currentList) {
        if (currentList.type === 'ul') {
          elements.push(
            <ul key={`ul-${key}`} className="my-3 space-y-1.5 list-disc pl-6 text-slate-800 font-normal">
              {currentList.items.map((item, i) => (
                <li key={i} dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
              ))}
            </ul>
          );
        } else {
          elements.push(
            <ol key={`ol-${key}`} className="my-3 space-y-1.5 list-decimal pl-6 text-slate-800 font-normal">
              {currentList.items.map((item, i) => (
                <li key={i} dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
              ))}
            </ol>
          );
        }
        currentList = null;
      }
    };

    const formatInline = (text: string): string => {
      return text
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
        .replace(/`(.*?)`/g, '<code class="bg-slate-100 text-blue-800 px-1 py-0.5 rounded text-xs font-mono">$1</code>');
    };

    lines.forEach((line, index) => {
      const trimmed = line.trim();

      if (!trimmed) {
        flushList(index);
        return;
      }

      // Heading 1
      if (trimmed.startsWith('# ')) {
        flushList(index);
        elements.push(
          <h1
            key={`h1-${index}`}
            className="text-2xl sm:text-3xl font-extrabold text-[#010E38] pt-6 pb-2 border-b-2 border-blue-100 tracking-tight"
          >
            {trimmed.slice(2)}
          </h1>
        );
        return;
      }

      // Heading 2
      if (trimmed.startsWith('## ')) {
        flushList(index);
        elements.push(
          <h2
            key={`h2-${index}`}
            className="text-xl sm:text-2xl font-bold text-[#005CBF] pt-5 pb-1.5 border-b border-slate-200 tracking-tight"
          >
            {trimmed.slice(3)}
          </h2>
        );
        return;
      }

      // Heading 3
      if (trimmed.startsWith('### ')) {
        flushList(index);
        elements.push(
          <h3
            key={`h3-${index}`}
            className="text-base sm:text-lg font-bold text-slate-900 pt-3 pb-1"
          >
            {trimmed.slice(4)}
          </h3>
        );
        return;
      }

      // Callout / Blockquote
      if (trimmed.startsWith('> ')) {
        flushList(index);
        elements.push(
          <div
            key={`quote-${index}`}
            className="my-4 p-4 rounded-xl bg-amber-50 border-l-4 border-[#FC7600] text-amber-950 shadow-xs flex items-start gap-3"
          >
            <div className="w-2 h-2 rounded-full bg-[#FC7600] mt-2 flex-shrink-0" />
            <div
              className="text-sm font-medium leading-relaxed"
              dangerouslySetInnerHTML={{ __html: formatInline(trimmed.slice(2)) }}
            />
          </div>
        );
        return;
      }

      // Unordered list item
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        if (!currentList || currentList.type !== 'ul') {
          flushList(index);
          currentList = { type: 'ul', items: [] };
        }
        currentList.items.push(trimmed.slice(2));
        return;
      }

      // Ordered list item
      const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
      if (numMatch) {
        if (!currentList || currentList.type !== 'ol') {
          flushList(index);
          currentList = { type: 'ol', items: [] };
        }
        currentList.items.push(numMatch[2]);
        return;
      }

      // Standard paragraph
      flushList(index);
      elements.push(
        <p
          key={`p-${index}`}
          className="my-3 text-slate-800 text-justify"
          dangerouslySetInnerHTML={{ __html: formatInline(trimmed) }}
        />
      );
    });

    flushList(lines.length);
    return elements;
  };

  // Repeating diagonal Notes Study watermark SVG background pattern
  const watermarkPattern = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="320" height="220" viewBox="0 0 320 220"><text x="160" y="110" fill="%23010E38" fill-opacity="0.05" font-size="22" font-family="system-ui, -apple-system, sans-serif" font-weight="bold" letter-spacing="1" text-anchor="middle" transform="rotate(-30 160 110)">notesstudy.online</text></svg>`;

  return (
    <div
      id="text-reader-container"
      onContextMenu={(e) => e.preventDefault()}
      className={`bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col select-none ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none border-none' : 'min-h-[85vh]'
      }`}
      style={{
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none'
      }}
    >
      {/* Reader Controls Toolbar */}
      <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between gap-4 flex-wrap select-none sticky top-0 z-20">
        
        {/* Document Information */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/30">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-white max-w-xs sm:max-w-md truncate">
              {note.title}
            </h2>
            <div className="flex items-center gap-2 text-[10px] text-slate-400">
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                <ShieldCheck className="w-3 h-3" />
                Protected Text Document
              </span>
              <span>•</span>
              <span>{note.categoryName}</span>
              {note.author && (
                <>
                  <span>•</span>
                  <span>By {note.author}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Reader Customization & Viewing Tools */}
        <div className="flex items-center gap-2">
          {/* Font Size Adjuster */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl px-2 py-1 gap-1 text-slate-400">
            <Type className="w-3.5 h-3.5 text-slate-500" />
            <button
              onClick={() => setFontSize('sm')}
              className={`text-[11px] px-1.5 py-0.5 rounded font-bold transition-colors ${
                fontSize === 'sm' ? 'bg-indigo-600 text-white' : 'hover:text-white'
              }`}
              title="Small font"
            >
              A-
            </button>
            <button
              onClick={() => setFontSize('base')}
              className={`text-[11px] px-1.5 py-0.5 rounded font-bold transition-colors ${
                fontSize === 'base' ? 'bg-indigo-600 text-white' : 'hover:text-white'
              }`}
              title="Normal font"
            >
              A
            </button>
            <button
              onClick={() => setFontSize('lg')}
              className={`text-[11px] px-1.5 py-0.5 rounded font-bold transition-colors ${
                fontSize === 'lg' ? 'bg-indigo-600 text-white' : 'hover:text-white'
              }`}
              title="Large font"
            >
              A+
            </button>
          </div>

          {/* Zoom Buttons */}
          <div className="hidden sm:flex items-center bg-slate-900 border border-slate-800 rounded-xl px-2 py-1 gap-1">
            <button
              onClick={() => setZoomLevel((z) => Math.max(75, z - 10))}
              disabled={zoomLevel <= 75}
              className="p-1 hover:text-white text-slate-400 disabled:opacity-40"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono text-slate-300 px-1">{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(140, z + 10))}
              disabled={zoomLevel >= 140}
              className="p-1 hover:text-white text-slate-400 disabled:opacity-40"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Copy Warning Notification Banner */}
      {copyWarning && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 text-amber-300 text-xs px-4 py-2 flex items-center justify-center gap-2 animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-amber-400" />
          <span>Copying, printing, and saving are restricted on Notes Study protected documents.</span>
        </div>
      )}

      {/* Document Workspace (Gray PDF-like backdrop with centered Paper page) */}
      <div className="flex-1 bg-slate-800/80 p-4 sm:p-8 overflow-y-auto flex justify-center items-start">
        
        {/* The Paper Document */}
        <div
          className="w-full max-w-4xl bg-white text-slate-900 rounded-2xl shadow-2xl p-8 sm:p-14 relative border border-slate-200 transition-transform duration-150 ease-out"
          style={{
            zoom: `${zoomLevel}%`,
            backgroundImage: `url('${watermarkPattern}')`,
            backgroundRepeat: 'repeat',
            backgroundPosition: 'center top'
          }}
          onCopy={(e) => {
            e.preventDefault();
            triggerCopyWarning();
          }}
          onCut={(e) => e.preventDefault()}
          onDragStart={(e) => e.preventDefault()}
        >
          {/* Subtle Document Header Bar */}
          <div className="flex items-center justify-between border-b-2 border-[#005CBF] pb-4 mb-6 select-none opacity-80">
            <div>
              <span className="text-[11px] font-black uppercase tracking-widest text-[#005CBF]">
                Notes Study • Official Study Material
              </span>
              <p className="text-xs text-slate-500 font-medium">www.notesstudy.online</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-1 rounded-md font-semibold border border-slate-200">
                Verified Aspirant Material
              </span>
            </div>
          </div>

          {/* Formatted Educational Content */}
          <div className={`${fontSizeClasses} space-y-2 select-none relative z-10`}>
            {renderDocumentContent(note.textContent || '')}
          </div>

          {/* Document Footer Bar */}
          <div className="mt-12 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400 select-none">
            <span className="font-semibold text-slate-500">
              © 2026 Notes Study · Learn • Practice • Grow
            </span>
            <span className="font-mono text-[11px] text-slate-400">
              Digital Document Reader · notesstudy.online
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}
