'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled Application Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-16 sm:py-24">
        <div className="max-w-md w-full text-center space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-gray-200 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 text-red-500 border border-red-500/20 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold font-mono tracking-widest text-red-600 uppercase bg-red-50 px-3 py-1 rounded-full border border-red-200">
              System Notice
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Something Went Wrong
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto">
              An unexpected error occurred while loading this page. Please try refreshing or return to the marketplace.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => reset()}
              className="inline-flex items-center justify-center gap-2 bg-[#005CBF] hover:bg-[#004a9e] text-white font-bold text-xs px-5 py-3 rounded-xl transition-colors shadow-xs cursor-pointer"
            >
              <RefreshCcw className="w-4 h-4" />
              <span>Try Again</span>
            </button>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-3 rounded-xl transition-colors shadow-xs"
            >
              <Home className="w-4 h-4" />
              <span>Return Home</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
