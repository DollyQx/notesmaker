'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import NoteCard from '@/components/NoteCard';
import { useData } from '@/context/DataContext';
import {
  BookOpen,
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Star,
  Award,
  Zap,
  CheckCircle2,
  TrendingUp,
  FileCheck,
  GraduationCap
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { notes, categories } = useData();
  const [searchQuery, setSearchQuery] = useState('');

  const featuredNotes = notes.filter(n => n.featured || n.isBestseller).slice(0, 6);
  const bestsellers = notes.filter(n => n.salesCount > 500).slice(0, 3);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/notes?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-indigo-950 via-slate-900 to-indigo-950 text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Gradients & Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-purple-600/15 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-indigo-300 text-xs font-semibold mb-6 animate-pulse">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>₹6,000 Project Demo • Verified Topper Handwritten Notes</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight mb-6">
            Ace Your Semester & Entrance Exams with{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-300 to-amber-300">
              Topper Handwritten Notes
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            Instant digital access to high-yield notes, mind maps, formula sheets, and solved pyqs. Read securely online via our built-in PDF viewer.
          </p>

          {/* Hero Search Box */}
          <form onSubmit={handleHeroSearch} className="max-w-2xl mx-auto mb-10">
            <div className="bg-white p-2 rounded-2xl shadow-2xl flex flex-col sm:flex-row items-center gap-2 border border-white/20">
              <div className="flex-1 flex items-center gap-3 px-4 py-2 w-full">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search subject e.g. DSA, Polity, Anatomy, B.Tech..."
                  className="w-full text-sm text-gray-900 placeholder-gray-400 bg-transparent focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-6 py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>Find Notes</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-12 text-xs font-semibold text-slate-400 pt-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>100% Verified Content</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Instant Web PDF Access</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Starting at just ₹99</span>
            </div>
          </div>
        </div>
      </section>

      {/* Category Pills Bar */}
      <section className="-mt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200/80 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500">Explore by Discipline</h2>
            <Link href="/notes" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
              View All Categories <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/notes?category=${cat.id}`}
                className="group p-3.5 rounded-xl bg-gray-50 hover:bg-indigo-50 border border-gray-100 hover:border-indigo-200 transition-all flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-xs font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                    {cat.name}
                  </h3>
                  <p className="text-[10px] text-gray-400 line-clamp-1 mt-0.5">{cat.description}</p>
                </div>
                <div className="mt-3 flex items-center justify-between text-[11px] text-indigo-600 font-semibold">
                  <span>Browse</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured & Bestselling Notes Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">
              <TrendingUp className="w-4 h-4" />
              Top Rated Notes
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Bestselling Study Material
            </h2>
          </div>
          <Link
            href="/notes"
            className="inline-flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold px-4 py-2.5 rounded-xl transition-colors self-start sm:self-auto"
          >
            <span>See All Notes ({notes.length})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {featuredNotes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredNotes.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
            <p className="text-sm text-gray-500">No notes available right now.</p>
          </div>
        )}
      </section>

      {/* Platform Features / Why Choose Us */}
      <section className="py-16 bg-gradient-to-b from-slate-900 to-indigo-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
              Built for Student Convenience
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mt-3">
              Why Students Trust NotesMaker
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-800/60 backdrop-blur-md border border-slate-700 p-8 rounded-2xl hover:border-indigo-500/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-6">
                <FileCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Topper Verified Notes</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Handwritten notes from rankers in IIT, AIIMS, BITS, and UPSC toppers. Curated and reviewed before listing.
              </p>
            </div>

            <div className="bg-slate-800/60 backdrop-blur-md border border-slate-700 p-8 rounded-2xl hover:border-purple-500/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-6">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Integrated PDF Web Reader</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Read seamlessly in browser on laptop, tablet, or mobile. Protected reader mode keeps notes secure and accessible anytime.
              </p>
            </div>

            <div className="bg-slate-800/60 backdrop-blur-md border border-slate-700 p-8 rounded-2xl hover:border-amber-500/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-6">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Budget-Friendly Access</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                High quality study materials at fractional price points starting from ₹99. Lifetime access once unlocked.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 rounded-3xl p-8 sm:p-12 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="space-y-4 max-w-xl relative z-10">
            <span className="bg-white/10 text-indigo-100 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Start Studying Today
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Ready to Boost Your Exam Scores?
            </h2>
            <p className="text-xs sm:text-sm text-indigo-100 leading-relaxed">
              Join 5,000+ students accessing verified handwritten digital notes across Engineering, Medical, UPSC, and CS streams.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 relative z-10 w-full sm:w-auto">
            <Link
              href="/notes"
              className="w-full sm:w-auto bg-white text-indigo-900 hover:bg-indigo-50 font-bold text-xs px-6 py-3.5 rounded-xl shadow-lg transition-all text-center"
            >
              Browse Notes Library
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto bg-indigo-900/60 hover:bg-indigo-900 border border-white/20 text-white font-bold text-xs px-6 py-3.5 rounded-xl transition-all text-center"
            >
              Student Portal
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
