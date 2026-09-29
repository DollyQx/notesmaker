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
  AlertCircle,
  Loader2
} from 'lucide-react';
import { sanitizeTextContent } from '@/lib/sanitize';

interface TextNoteReaderProps {
  note: Note;
  isPreview?: boolean;
  directContent?: string;
}

export default function TextNoteReader({ note, isPreview = false, directContent }: TextNoteReaderProps) {
  const [content, setContent] = useState<string>(directContent || note.textContent || '');
  const [isLoadingContent, setIsLoadingContent] = useState<boolean>(!directContent && !note.textContent);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg' | 'xl'>('base');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copyWarning, setCopyWarning] = useState(false);

  // Sync content if directContent or note changes
  useEffect(() => {
    if (directContent !== undefined) {
      setContent(directContent);
      setIsLoadingContent(false);
    }
  }, [directContent]);

  // Securely fetch authorized text content from server if not already provided
  useEffect(() => {
    if (isPreview || directContent !== undefined || content) return;

    let isMounted = true;
    setIsLoadingContent(true);
    setErrorMsg('');

    fetch(`/api/notes/${note.id}/content`, {
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache' }
    })
      .then(async (res) => {
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `Access denied (${res.status})`);
        }
        return res.json();
      })
      .then((data) => {
        if (isMounted) {
          if (data.success && data.textContent) {
            setContent(data.textContent);
          } else {
            setErrorMsg('No text content available for this note document.');
          }
          setIsLoadingContent(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setErrorMsg(err.message || 'Failed to authorize document reader.');
          setIsLoadingContent(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [note.id, isPreview, directContent, content]);

  // Client-side text copy protection: intercept shortcuts, context menu, and selection
  useEffect(() => {
    if (isPreview) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const isCmdOrCtrl = e.ctrlKey || e.metaKey;
      const key = e.key.toLowerCase();

      // Intercept Ctrl+C (Copy), Ctrl+X (Cut), Ctrl+A (Select All), Ctrl+P (Print), Ctrl+S (Save), Ctrl+U (View Source)
      if (isCmdOrCtrl && (key === 'c' || key === 'x' || key === 'a' || key === 'p' || key === 's' || key === 'u')) {
        e.preventDefault();
        e.stopPropagation();
        triggerCopyWarning();
      }
    };

    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      triggerCopyWarning();
    };

    const handleCut = (e: ClipboardEvent) => {
      e.preventDefault();
      triggerCopyWarning();
    };

    window.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('copy', handleCopy, true);
    window.addEventListener('cut', handleCut, true);

    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('copy', handleCopy, true);
      window.removeEventListener('cut', handleCut, true);
    };
  }, [isPreview]);

  const triggerCopyWarning = () => {
    setCopyWarning(true);
    setTimeout(() => setCopyWarning(false), 3500);
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
    sm: 'text-sm leading-relaxed sm:leading-relaxed',
    base: 'text-base leading-relaxed sm:leading-loose',
    lg: 'text-lg leading-loose sm:leading-loose',
    xl: 'text-xl leading-loose sm:leading-loose'
  }[fontSize];

  // Repeating diagonal Notes Study watermark SVG background pattern
  const watermarkSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="360" height="240" viewBox="0 0 360 240"><g transform="rotate(-30 180 120)" text-anchor="middle" fill="%23010E38" fill-opacity="0.04" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif" font-weight="700"><text x="180" y="110" font-size="20" letter-spacing="1">Notes Study</text><text x="180" y="132" font-size="12" font-weight="600" letter-spacing="0.5">notesstudy.online</text></g></svg>`;
  const watermarkPattern = `data:image/svg+xml;utf8,${encodeURIComponent(watermarkSvg)}`;

  const sanitizedHtml = sanitizeTextContent(content);

  return (
    <div
      id="text-reader-container"
      onContextMenu={(e) => {
        if (!isPreview) e.preventDefault();
      }}
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
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2 rounded-xl bg-orange-500/10 text-[#FC7600] border border-orange-500/30 flex-shrink-0">
            <BookOpen className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h2 className="text-xs sm:text-sm font-bold text-white truncate max-w-xs sm:max-w-md">
              {note.title}
            </h2>
            <div className="flex items-center gap-2 text-[10px] text-slate-400">
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                <ShieldCheck className="w-3 h-3" />
                {isPreview ? 'Admin Document Preview' : 'Protected Study Material'}
              </span>
              <span>•</span>
              <span className="truncate">{note.categoryName}</span>
              {note.author && (
                <>
                  <span className="hidden sm:inline">•</span>
                  <span className="hidden sm:inline truncate">By {note.author}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Reader Customization & Viewing Tools */}
        <div className="flex items-center gap-2">
          {/* Font Size Adjuster */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl px-2 py-1 gap-1 text-slate-400">
            <Type className="w-3.5 h-3.5 text-slate-500 hidden sm:block" />
            <button
              onClick={() => setFontSize('sm')}
              className={`text-[11px] px-2 py-0.5 rounded font-bold transition-colors ${
                fontSize === 'sm' ? 'bg-[#005CBF] text-white' : 'hover:text-white'
              }`}
              title="Small text"
            >
              A-
            </button>
            <button
              onClick={() => setFontSize('base')}
              className={`text-[11px] px-2 py-0.5 rounded font-bold transition-colors ${
                fontSize === 'base' ? 'bg-[#005CBF] text-white' : 'hover:text-white'
              }`}
              title="Normal text"
            >
              A
            </button>
            <button
              onClick={() => setFontSize('lg')}
              className={`text-[11px] px-2 py-0.5 rounded font-bold transition-colors ${
                fontSize === 'lg' ? 'bg-[#005CBF] text-white' : 'hover:text-white'
              }`}
              title="Large text"
            >
              A+
            </button>
          </div>

          {/* Zoom Buttons (Desktop) */}
          <div className="hidden md:flex items-center bg-slate-900 border border-slate-800 rounded-xl px-2 py-1 gap-1">
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
              onClick={() => setZoomLevel((z) => Math.min(130, z + 10))}
              disabled={zoomLevel >= 130}
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
        <div className="bg-amber-500/15 border-b border-amber-500/30 text-amber-300 text-xs px-4 py-2.5 flex items-center justify-center gap-2 animate-fadeIn transition-all">
          <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span>Personal Reading License: Copying, printing, and extracting content are restricted.</span>
        </div>
      )}

      {/* Document Workspace (Gray backdrop with centered Paper page) */}
      <div className="flex-1 bg-slate-850 p-3 sm:p-8 overflow-y-auto flex justify-center items-start">
        {isLoadingContent ? (
          <div className="py-24 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-[#005CBF] animate-spin mx-auto" />
            <p className="text-xs text-slate-400">Loading protected document content...</p>
          </div>
        ) : errorMsg ? (
          <div className="max-w-md mx-auto my-12 bg-slate-900 border border-slate-800 p-8 rounded-3xl text-center space-y-4">
            <Lock className="w-10 h-10 text-amber-400 mx-auto" />
            <h3 className="text-base font-bold text-white">Access Restricted</h3>
            <p className="text-xs text-slate-400">{errorMsg}</p>
          </div>
        ) : (
          /* The Paper Document Surface */
          <div
            className="w-full max-w-4xl bg-white text-slate-900 rounded-2xl shadow-2xl p-6 sm:p-14 relative border border-slate-200 transition-all duration-150 ease-out"
            style={{
              zoom: `${zoomLevel}%`,
              backgroundImage: `url('${watermarkPattern}')`,
              backgroundRepeat: 'repeat',
              backgroundPosition: 'center top'
            }}
            onCopy={(e) => {
              if (!isPreview) {
                e.preventDefault();
                triggerCopyWarning();
              }
            }}
            onCut={(e) => {
              if (!isPreview) e.preventDefault();
            }}
            onDragStart={(e) => {
              if (!isPreview) e.preventDefault();
            }}
          >
            {/* Document Header Bar */}
            <div className="flex items-center justify-between border-b-2 border-[#005CBF] pb-4 mb-6 select-none opacity-85">
              <div>
                <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-[#005CBF] block">
                  Notes Study • Digital Topper Notes
                </span>
                <p className="text-[11px] text-slate-500 font-medium">notesstudy.online</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono bg-blue-50 text-[#005CBF] px-2.5 py-1 rounded-md font-bold border border-blue-100 inline-block">
                  Verified Exam Material
                </span>
              </div>
            </div>

            {/* Document Title Header */}
            <div className="mb-8 pb-4 border-b border-slate-100">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#010E38] tracking-tight">
                {note.title}
              </h1>
              {note.description && (
                <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                  {note.description}
                </p>
              )}
            </div>

            {/* Formatted Educational Rich Text Content */}
            <div
              className={`study-document-content ${fontSizeClasses} select-none relative z-10 text-slate-800 break-words`}
              dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
            />

            {/* Document Footer Bar */}
            <div className="mt-14 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 select-none">
              <span className="font-semibold text-slate-500 text-center sm:text-left">
                © 2026 Notes Study · Learn • Practice • Grow
              </span>
              <span className="font-mono text-[11px] text-slate-400 text-center sm:text-right">
                Protected Document · notesstudy.online
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Styled Scoped Stylesheet for Rich Educational Text */}
      <style jsx global>{`
        .study-document-content h1 {
          font-size: 1.75rem;
          font-weight: 800;
          color: #010E38;
          margin-top: 1.75rem;
          margin-bottom: 0.75rem;
          padding-bottom: 0.35rem;
          border-bottom: 2px solid #e2e8f0;
          line-height: 1.25;
        }
        .study-document-content h2 {
          font-size: 1.35rem;
          font-weight: 700;
          color: #005CBF;
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
          padding-bottom: 0.25rem;
          border-bottom: 1px solid #f1f5f9;
          line-height: 1.3;
        }
        .study-document-content h3 {
          font-size: 1.15rem;
          font-weight: 700;
          color: #0f172a;
          margin-top: 1.25rem;
          margin-bottom: 0.35rem;
          line-height: 1.35;
        }
        .study-document-content h4 {
          font-size: 1rem;
          font-weight: 600;
          color: #1e293b;
          margin-top: 1rem;
          margin-bottom: 0.25rem;
        }
        .study-document-content p {
          margin-top: 0.65rem;
          margin-bottom: 0.65rem;
          color: #1e293b;
          line-height: 1.75;
        }
        .study-document-content strong,
        .study-document-content b {
          font-weight: 700;
          color: #0f172a;
        }
        .study-document-content em,
        .study-document-content i {
          font-style: italic;
        }
        .study-document-content u {
          text-decoration: underline;
          text-underline-offset: 3px;
        }
        .study-document-content blockquote {
          margin: 1.25rem 0;
          padding: 1rem 1.25rem;
          background-color: #fff7ed;
          border-left: 4px solid #FC7600;
          border-radius: 0.75rem;
          color: #7c2d12;
          font-size: 0.95em;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }
        .study-document-content mark {
          background-color: #fef08a;
          color: #713f12;
          padding: 0.1em 0.35em;
          border-radius: 0.25rem;
          font-weight: 600;
        }
        .study-document-content ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin: 0.75rem 0;
          space-y: 0.25rem;
        }
        .study-document-content ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
          margin: 0.75rem 0;
          space-y: 0.25rem;
        }
        .study-document-content li {
          margin-top: 0.25rem;
          margin-bottom: 0.25rem;
          line-height: 1.6;
        }
        .study-document-content code {
          background-color: #f1f5f9;
          color: #005CBF;
          padding: 0.15rem 0.35rem;
          border-radius: 0.35rem;
          font-size: 0.85em;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        }
        .study-document-content hr {
          border-color: #e2e8f0;
          margin: 1.5rem 0;
        }
        .study-document-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 1rem 0;
          font-size: 0.9em;
        }
        .study-document-content th,
        .study-document-content td {
          border: 1px solid #cbd5e1;
          padding: 0.5rem 0.75rem;
          text-align: left;
        }
        .study-document-content th {
          background-color: #f8fafc;
          font-weight: 700;
        }
      `}</style>
    </div>
  );
}
