'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, ShieldCheck, DownloadCloud, Award, Lock, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Value Props Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-10 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Topper Curated</h4>
              <p className="text-xs text-slate-400">Handwritten by top rankers</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Secure Access</h4>
              <p className="text-xs text-slate-400">Instant PDF web reader</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Verified Content</h4>
              <p className="text-xs text-slate-400">100% curriculum aligned</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
              <DownloadCloud className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Lifetime Access</h4>
              <p className="text-xs text-slate-400">Read anywhere on any device</p>
            </div>
          </div>
        </div>

        {/* Footer Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-10">
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-lg text-white tracking-tight">NotesMaker</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              India&apos;s lightweight digital notes marketplace for university students, competitive exam aspirants & lifelong learners.
            </p>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Popular Subjects</h5>
            <ul className="space-y-2 text-xs">
              <li><Link href="/notes?category=cat-1" className="hover:text-indigo-400 transition-colors">Data Structures & Tech</Link></li>
              <li><Link href="/notes?category=cat-4" className="hover:text-indigo-400 transition-colors">UPSC Indian Polity</Link></li>
              <li><Link href="/notes?category=cat-3" className="hover:text-indigo-400 transition-colors">NEET Biology & Chem</Link></li>
              <li><Link href="/notes?category=cat-2" className="hover:text-indigo-400 transition-colors">Engineering (B.Tech)</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Quick Navigation</h5>
            <ul className="space-y-2 text-xs">
              <li><Link href="/notes" className="hover:text-indigo-400 transition-colors">Browse Notes Marketplace</Link></li>
              <li><Link href="/my-notes" className="hover:text-indigo-400 transition-colors">My Purchased Notes</Link></li>
              <li><Link href="/login" className="hover:text-indigo-400 transition-colors">Student Login</Link></li>
              <li><Link href="/admin/login" className="hover:text-indigo-400 transition-colors">Admin Portal</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Student Support</h5>
            <p className="text-xs text-slate-400 mb-2">Have a question or request notes?</p>
            <a href="mailto:support@notesmaker.in" className="inline-block bg-slate-800 hover:bg-slate-700 text-indigo-400 text-xs font-semibold px-3 py-2 rounded-lg border border-slate-700 transition-colors">
              support@notesmaker.in
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} NotesMaker Digital Marketplace. All rights reserved.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            <span>for Students & Rankers</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
