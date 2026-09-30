import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FileQuestion, ArrowRight, Home, BookOpen } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-16 sm:py-24">
        <div className="max-w-md w-full text-center space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-gray-200 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center mx-auto">
            <FileQuestion className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold font-mono tracking-widest text-amber-600 uppercase bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              Error 404
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Page Not Found
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto">
              The page or study note you are looking for doesn&apos;t exist, has been unlisted, or was moved.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-3 rounded-xl transition-colors shadow-xs"
            >
              <Home className="w-4 h-4" />
              <span>Return Home</span>
            </Link>
            <Link
              href="/notes"
              className="inline-flex items-center justify-center gap-2 bg-[#005CBF] hover:bg-[#004a9e] text-white font-bold text-xs px-5 py-3 rounded-xl transition-colors shadow-xs"
            >
              <BookOpen className="w-4 h-4" />
              <span>Browse Notes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
