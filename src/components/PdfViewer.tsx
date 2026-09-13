'use client';

import React, { useState, useEffect } from 'react';
import { Note } from '@/types';
import { useAuth } from '@/context/AuthContext';
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  ShieldCheck,
  Lock,
  RotateCcw,
  BookOpen
} from 'lucide-react';

interface PdfViewerProps {
  note: Note;
}

export default function PdfViewer({ note }: PdfViewerProps) {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const totalPages = note.pages || 45;

  // Security measure: Prevent standard print attempt
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent Ctrl+P or Cmd+P
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        alert('Printing and downloading are disabled to protect copyright.');
      }
      // Prevent Ctrl+S or Cmd+S
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        alert('Saving is disabled for digital notes.');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(p => p + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(p => p - 1);
  };

  const handleZoomIn = () => {
    if (zoomLevel < 200) setZoomLevel(z => z + 25);
  };

  const handleZoomOut = () => {
    if (zoomLevel > 50) setZoomLevel(z => z - 25);
  };

  const toggleFullscreen = () => {
    const element = document.getElementById('pdf-reader-container');
    if (!element) return;

    if (!document.fullscreenElement) {
      element.requestFullscreen().then(() => setIsFullscreen(true)).catch(err => console.error(err));
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(err => console.error(err));
    }
  };

  return (
    <div
      id="pdf-reader-container"
      onContextMenu={(e) => e.preventDefault()}
      className={`bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none border-none' : 'h-[82vh]'
      }`}
    >
      {/* Top PDF Toolbar - NO DOWNLOAD BUTTON */}
      <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between gap-4 flex-wrap select-none">
        
        {/* Left: Document Info */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-white max-w-xs sm:max-w-md truncate">{note.title}</h2>
            <div className="flex items-center gap-2 text-[10px] text-slate-400">
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                <ShieldCheck className="w-3 h-3" />
                Verified Purchase License
              </span>
              <span>•</span>
              <span>{note.author}</span>
            </div>
          </div>
        </div>

        {/* Center Controls: Page Navigation */}
        <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="p-1 rounded text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent"
            title="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1 text-slate-300 font-medium">
            <span>Page</span>
            <input
              type="number"
              min={1}
              max={totalPages}
              value={currentPage}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (val >= 1 && val <= totalPages) setCurrentPage(val);
              }}
              className="w-10 text-center bg-slate-950 border border-slate-700 rounded text-white py-0.5 text-xs font-bold focus:outline-none focus:border-indigo-500"
            />
            <span>of {totalPages}</span>
          </div>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="p-1 rounded text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent"
            title="Next Page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right Controls: Zoom & View Security Notice */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={handleZoomOut}
              className="p-1 text-slate-300 hover:text-white hover:bg-slate-800 rounded"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-bold text-slate-300 w-10 text-center">{zoomLevel}%</span>
            <button
              onClick={handleZoomIn}
              className="p-1 text-slate-300 hover:text-white hover:bg-slate-800 rounded"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(100)}
              className="p-1 text-slate-400 hover:text-white rounded ml-1"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>

          <button
            onClick={toggleFullscreen}
            className="p-2 text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-800 transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <div className="hidden xl:flex items-center gap-1.5 text-[10px] bg-amber-500/10 text-amber-300 border border-amber-500/30 px-2.5 py-1.5 rounded-xl">
            <Lock className="w-3 h-3 text-amber-400" />
            <span>Protected Reader Mode</span>
          </div>
        </div>
      </div>

      {/* Main Document Display Canvas Area */}
      <div className="flex-1 overflow-auto bg-slate-950 p-6 flex justify-center relative select-none">
        
        {/* Document Page Box */}
        <div
          style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
          className="transition-transform duration-150 w-full max-w-3xl bg-white text-slate-900 rounded-xl shadow-2xl p-8 sm:p-12 relative min-h-[850px] flex flex-col justify-between"
        >
          {/* Security Watermark Background */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden opacity-5 z-0">
            <div className="rotate-[-35deg] text-center font-extrabold text-slate-900 text-3xl sm:text-5xl tracking-widest leading-relaxed">
              LICENSED TO {user?.name.toUpperCase() || 'STUDENT'}<br />
              {user?.email || 'STUDENT@NOTESMAKER.IN'}<br />
              CONFIDENTIAL • DO NOT DISTRIBUTE
            </div>
          </div>

          {/* Header of PDF page */}
          <div className="border-b border-gray-200 pb-4 mb-6 flex justify-between items-center relative z-10">
            <div>
              <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-wider">{note.categoryName}</span>
              <h3 className="text-lg font-bold text-gray-900">{note.title}</h3>
            </div>
            <span className="text-xs text-gray-400 font-mono">Page {currentPage} of {totalPages}</span>
          </div>

          {/* Simulated Note Content Body */}
          <div className="space-y-6 text-sm text-gray-800 leading-relaxed relative z-10 flex-1">
            <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 font-mono text-xs text-indigo-950">
              <span className="font-bold uppercase text-indigo-700">Topic Summary • Section {currentPage}</span>
              <p className="mt-1">{note.subCategoryName} - Handwritten High-Yield Key Points</p>
            </div>

            {note.sampleText ? (
              <div className="whitespace-pre-line font-sans text-slate-800 leading-relaxed bg-gray-50/80 p-5 rounded-xl border border-gray-200">
                {note.sampleText}
              </div>
            ) : (
              <div className="space-y-4">
                <p className="font-medium text-gray-900">
                  1. Core Definition & Theoretical Foundations (Page {currentPage})
                </p>
                <p className="text-gray-700">
                  In modern curricula, this subject explores fundamental principles requiring precise conceptual clarity.
                  Key formulas and memory triggers are highlighted below for examination quick recall.
                </p>

                <div className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs shadow-inner">
                  {`// Core Exam Formula / Standard Blueprint (Page ${currentPage})
function calculateYield(inputVector) {
  const constant = 3.14159;
  return inputVector.reduce((acc, val) => acc + (val * constant), 0);
}`}
                </div>

                <p className="text-gray-700">
                  2. Practical Application & Frequently Asked Exam Questions:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  <li>Analyze the key trade-offs between theoretical models and real-world execution.</li>
                  <li>Identify the 3 critical failure conditions most common in university semester papers.</li>
                  <li>Diagram requirements: Ensure all labeled components are clearly drawn with units.</li>
                </ul>
              </div>
            )}

            {/* Simulated Handwritten Diagram / Note Canvas Box */}
            <div className="mt-6 p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200/80 text-amber-950">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase text-amber-800">✍️ Topper Tip / High Yield Note</span>
                <span className="text-[10px] font-mono text-amber-700">GATE / University Special</span>
              </div>
              <p className="text-xs italic leading-relaxed text-amber-900">
                &quot;Remember to always write the standard assumptions before solving long numerical questions. Professors award up to 2 marks for standard steps!&quot;
              </p>
            </div>
          </div>

          {/* Footer of PDF page */}
          <div className="mt-8 pt-4 border-t border-gray-200 flex justify-between items-center text-xs text-gray-400 relative z-10">
            <span>NotesMaker Digital License • {note.author}</span>
            <span className="font-mono">Page {currentPage}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
