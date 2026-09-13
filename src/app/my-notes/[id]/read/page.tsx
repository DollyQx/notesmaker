'use client';

import React, { use } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PdfViewer from '@/components/PdfViewer';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import { Lock, ArrowLeft, ShieldAlert, BookOpen } from 'lucide-react';

export default function PdfReadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { getNoteById } = useData();
  const { hasPurchased } = useAuth();

  const note = getNoteById(id);
  const isUnlocked = hasPurchased(id);

  if (!note) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-950 text-white">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-6 text-center">
          <div className="max-w-md bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-4">
            <BookOpen className="w-12 h-12 text-slate-500 mx-auto" />
            <h2 className="text-lg font-bold">Document Not Found</h2>
            <Link href="/notes" className="inline-block bg-indigo-600 text-white text-xs font-bold px-4 py-2 rounded-xl">
              Back to Marketplace
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!isUnlocked) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-950 text-white">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-6 text-center">
          <div className="max-w-md bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-4 shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold">Access Permission Restricted</h2>
            <p className="text-xs text-slate-400">
              You must purchase this note before accessing the online PDF reader.
            </p>
            <div className="pt-2">
              <Link
                href={`/notes/${note.id}`}
                className="w-full inline-block bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-3 rounded-xl transition-colors"
              >
                View Note Details & Unlock (₹{note.price})
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 w-full flex items-center justify-between">
        <Link
          href="/my-notes"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Purchased Library</span>
        </Link>

        <div className="flex items-center gap-2 text-[11px] bg-slate-900 border border-slate-800 px-3 py-1 rounded-full text-slate-400 font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Encrypted Session Active</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 w-full flex-1">
        <PdfViewer note={note} />
      </div>

      <Footer />
    </div>
  );
}
