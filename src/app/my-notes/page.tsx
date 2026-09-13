'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import {
  FileText,
  BookOpen,
  CheckCircle2,
  Lock,
  ArrowRight,
  Calendar,
  CreditCard,
  Loader2
} from 'lucide-react';

export default function MyNotesPage() {
  const { notes } = useData();
  const { user, purchasedNoteIds } = useAuth();
  const [purchasesList, setPurchasesList] = useState<any[]>([]);
  const [isLoadingPurchases, setIsLoadingPurchases] = useState(false);

  useEffect(() => {
    if (user) {
      setIsLoadingPurchases(true);
      fetch('/api/purchases')
        .then(res => res.json())
        .then(data => {
          setIsLoadingPurchases(false);
          if (data.success && data.purchases) {
            setPurchasesList(data.purchases);
          }
        })
        .catch(() => setIsLoadingPurchases(false));
    }
  }, [user]);

  // Combine DB purchases with Context state
  const purchasedNotes = notes.filter(n => user?.role === 'ADMIN' || purchasedNoteIds.includes(n.id));

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-indigo-400 font-bold uppercase tracking-wider mb-2">
              <FileText className="w-4 h-4" />
              <span>Student Personal Library</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              My Purchased Digital Notes
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Access your unlocked topper notes anytime. Read securely in our online browser reader.
            </p>
          </div>

          <div className="hidden sm:block bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold px-4 py-2 rounded-2xl">
            {purchasedNotes.length} Notes Unlocked
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        {!user ? (
          <div className="max-w-md mx-auto bg-white p-8 rounded-3xl border border-gray-200 shadow-xl text-center space-y-4">
            <Lock className="w-12 h-12 text-indigo-600 mx-auto" />
            <h2 className="text-lg font-bold text-gray-900">Student Login Required</h2>
            <p className="text-xs text-gray-500">Please sign in to view your purchased digital notes library.</p>
            <Link
              href="/login"
              className="inline-block bg-indigo-600 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md hover:bg-indigo-700 transition-colors"
            >
              Sign In to Your Account
            </Link>
          </div>
        ) : isLoadingPurchases ? (
          <div className="py-16 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
            <p className="text-xs font-medium text-gray-500">Loading your purchased notes library...</p>
          </div>
        ) : purchasedNotes.length > 0 ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-900">Your Unlocked Library ({purchasedNotes.length})</h2>
              <Link href="/notes" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                Browse Marketplace <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {purchasedNotes.map((note) => {
                const pRecord = purchasesList.find(p => p.noteId === note.id);
                const purchaseDate = pRecord
                  ? new Date(pRecord.purchasedAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })
                  : 'Active License';

                return (
                  <div
                    key={note.id}
                    className="bg-white rounded-2xl border border-gray-200 shadow-xs hover:shadow-lg transition-all p-6 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded-md border border-emerald-200/60 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> COMPLETED
                        </span>
                        <span className="text-gray-400 font-medium">{note.pages} Pages</span>
                      </div>

                      <h3 className="font-bold text-gray-900 text-base leading-snug line-clamp-2">
                        {note.title}
                      </h3>

                      <p className="text-xs text-gray-600 line-clamp-2">
                        {note.description}
                      </p>

                      <div className="text-[11px] text-gray-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-indigo-500" /> Date:
                          </span>
                          <span className="font-semibold text-gray-800">{purchaseDate}</span>
                        </div>
                        <div className="flex justify-between items-center pt-1 border-t border-slate-100">
                          <span className="text-gray-500 flex items-center gap-1">
                            <CreditCard className="w-3 h-3 text-indigo-500" /> Amount Paid:
                          </span>
                          <span className="font-bold text-indigo-600">₹{pRecord ? pRecord.amount : note.price}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-[10px] text-gray-400 font-mono">
                        {pRecord?.transactionId || 'LIC-VERIFIED'}
                      </span>

                      <Link
                        href={`/my-notes/${note.id}/read`}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                      >
                        <BookOpen className="w-4 h-4" />
                        <span>Read Note</span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="max-w-md mx-auto bg-white p-10 rounded-3xl border border-gray-200 text-center space-y-4 shadow-sm">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto" />
            <h2 className="text-lg font-bold text-gray-900">No Purchased Notes Yet</h2>
            <p className="text-xs text-gray-500">You haven&apos;t unlocked any digital notes yet. Browse our topper library to get started.</p>
            <Link
              href="/notes"
              className="inline-block bg-indigo-600 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md hover:bg-indigo-700 transition-colors"
            >
              Browse Notes Marketplace
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
