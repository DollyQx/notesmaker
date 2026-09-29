'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import NoteCard from '@/components/NoteCard';
import Logo from '@/components/Logo';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import {
  BookOpen,
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Award,
  Zap,
  GraduationCap,
  Target,
  FileCheck,
  Compass,
  CreditCard,
  Eye,
  MessageSquare,
  HelpCircle,
  Clock
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { notes, categories } = useData();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const featuredNotes = notes.filter((n) => n.featured || n.isBestseller).slice(0, 6);
  const displayNotes = featuredNotes.length > 0 ? featuredNotes : notes.slice(0, 6);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/notes?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9FC] text-slate-900">
      <Navbar />

      <main className="flex-1">
        {/* 1. Hero Section */}
        <section className="relative bg-gradient-to-b from-[#010E38] via-[#002B66] to-[#010E38] text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
          {/* Subtle background grid */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#0071D1_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

          <div className="max-w-5xl mx-auto relative z-10 text-center space-y-6">
            
            {/* Tagline / Brand Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-blue-200 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#FC7600]" />
              <span>Notes Study • Learn · Practice · Grow</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight">
              Excel in Competitive Exams with{' '}
              <span className="text-[#FC7600]">Curated Study Material</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
              High-yield notes, answer writing frameworks, and syllabus-targeted resources for <strong className="text-white font-semibold">UPSC, BPSC, UPPSC, BSSC</strong> and state competitive exams.
            </p>

            {/* Search Box */}
            <form onSubmit={handleHeroSearch} className="max-w-2xl mx-auto pt-2">
              <div className="bg-white p-2 rounded-2xl shadow-2xl flex flex-col sm:flex-row items-center gap-2 border border-slate-200">
                <div className="flex-1 flex items-center gap-3 px-4 py-2 w-full">
                  <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search UPSC GS, BPSC Special, Polity, History, Economy..."
                    className="w-full text-xs sm:text-sm text-slate-900 placeholder-slate-400 bg-transparent focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-[#005CBF] hover:bg-[#004a9e] text-white font-bold text-xs px-6 py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 flex-shrink-0"
                >
                  <span>Explore Notes</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* CTA Buttons for Students */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/notes"
                className="bg-[#FC7600] hover:bg-[#e06900] text-white font-bold text-xs px-6 py-3 rounded-xl shadow-lg shadow-orange-500/25 transition-all flex items-center gap-2"
              >
                <span>Browse All Notes</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              {!user ? (
                <Link
                  href="/register"
                  className="bg-white/10 hover:bg-white/20 border border-white/25 text-white font-semibold text-xs px-5 py-3 rounded-xl backdrop-blur-xs transition-all"
                >
                  Create Student Account
                </Link>
              ) : (
                <Link
                  href="/my-notes"
                  className="bg-white/10 hover:bg-white/20 border border-white/25 text-white font-semibold text-xs px-5 py-3 rounded-xl backdrop-blur-xs transition-all flex items-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#0071D1]" />
                  <span>My Purchased Library</span>
                </Link>
              )}
            </div>

            {/* Trust Points */}
            <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-10 text-xs font-semibold text-slate-300 pt-6">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Topper & Faculty Verified</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Instant Digital Web Access</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Affordable Student Pricing</span>
              </div>
            </div>

          </div>
        </section>

        {/* 2. Exam Categories Section */}
        <section className="-mt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200/90 p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#005CBF]">
                  Target Examinations
                </span>
                <h2 className="text-lg sm:text-xl font-extrabold text-[#010E38]">
                  Browse by Competitive Exam Category
                </h2>
              </div>
              <Link
                href="/notes"
                className="text-xs font-bold text-[#005CBF] hover:text-[#004a9e] flex items-center gap-1 transition-colors"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/notes?category=${cat.id}`}
                    className="group p-5 rounded-2xl bg-[#F7F9FC] hover:bg-blue-50/60 border border-slate-200 hover:border-[#005CBF]/40 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-white text-[#005CBF] border border-slate-200 group-hover:border-[#005CBF] flex items-center justify-center font-black text-sm mb-3 shadow-2xs transition-colors">
                        {cat.name.slice(0, 4)}
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#005CBF] transition-colors line-clamp-1">
                        {cat.name}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                        {cat.description || `Comprehensive study notes for ${cat.name} aspirants.`}
                      </p>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-xs text-[#005CBF] font-bold">
                      <span>Explore Notes</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                ))
              ) : (
                <div className="col-span-full text-center py-6 text-xs text-slate-500">
                  Loading categories...
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 3. Study Resources & Notes Grid (Free/Paid) */}
        <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#FC7600] mb-1">
                <TrendingUp className="w-4 h-4" />
                <span>Featured Aspirant Material</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#010E38] tracking-tight">
                High-Yield Study Notes & Series
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Carefully prepared modules with diagrams, flowcharts, and previous-year question mapping.
              </p>
            </div>
            <Link
              href="/notes"
              className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-[#005CBF] border border-slate-300 text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-colors self-start sm:self-auto"
            >
              <span>Explore All Notes ({notes.length})</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {displayNotes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayNotes.map((note) => (
                <NoteCard key={note.id} note={note} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 space-y-3">
              <BookOpen className="w-10 h-10 text-slate-400 mx-auto" />
              <p className="text-sm font-semibold text-slate-700">Notes catalog is being updated.</p>
              <p className="text-xs text-slate-400">Check back soon for freshly uploaded topper modules.</p>
            </div>
          )}
        </section>

        {/* 5. How It Works Section: Browse -> Purchase -> Read */}
        <section className="bg-white border-y border-slate-200 py-16 sm:py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#005CBF]">
                Simple & Seamless
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#010E38]">
                How Notes Study Works
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Unlock competitive exam notes in three straightforward steps.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Step 1 */}
              <div className="p-6 rounded-3xl bg-[#F7F9FC] border border-slate-200 space-y-4 text-center">
                <div className="w-14 h-14 rounded-2xl bg-blue-100 text-[#005CBF] font-black text-xl flex items-center justify-center mx-auto">
                  1
                </div>
                <h3 className="font-extrabold text-base text-[#010E38]">Browse & Select</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Search notes by exam category, read sample previews, and check page count and syllabus coverage.
                </p>
              </div>

              {/* Step 2 */}
              <div className="p-6 rounded-3xl bg-[#F7F9FC] border border-slate-200 space-y-4 text-center">
                <div className="w-14 h-14 rounded-2xl bg-orange-100 text-[#FC7600] font-black text-xl flex items-center justify-center mx-auto">
                  2
                </div>
                <h3 className="font-extrabold text-base text-[#010E38]">Official Checkout</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Pay securely via Razorpay (UPI, Cards, NetBanking). Transactions are encrypted and verified server-side.
                </p>
              </div>

              {/* Step 3 */}
              <div className="p-6 rounded-3xl bg-[#F7F9FC] border border-slate-200 space-y-4 text-center">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 font-black text-xl flex items-center justify-center mx-auto">
                  3
                </div>
                <h3 className="font-extrabold text-base text-[#010E38]">Instant Reading</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Access unlocked notes immediately in our web reader with watermarking and zoom controls on any device.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4 & 6. Why Notes Study & Key Features */}
        <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FC7600]">
              Built for Serious Aspirants
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#010E38]">
              Why Choose Notes Study for Your Exam
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Exam preparation requires targeted, distilled material rather than thousands of unstructured textbook pages.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#005CBF] flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Quality Study Material</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Concise summaries, standard reference book condensations, and exam-oriented diagrams for fast retention.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-11 h-11 rounded-xl bg-orange-50 text-[#FC7600] flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Easy Online Access</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                No bulky files or storage hassles. Read seamlessly in your web browser across mobile, tablet, and PC.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Secure Reading Mode</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Dedicated digital document reader with watermarking, distraction-free view, and protected student access.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#005CBF] flex items-center justify-center">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Competitive Exam Focused</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Structured specifically around the syllabus and trends of UPSC CSE, BPSC, UPPSC, and state PCS exams.
              </p>
            </div>
          </div>
        </section>

        {/* 7. About/Mission Preview Section */}
        <section className="bg-gradient-to-r from-[#010E38] to-[#002B66] text-white py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FC7600]">
              Our Purpose
            </span>
            <h2 className="text-2xl sm:text-3xl font-black">
              Making Quality Education Accessible & Affordable
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Notes Study is dedicated to helping students prepare for competitive examinations such as UPSC, BPSC, and other government exams. Our mission is to provide high-quality study notes, mock tests, and educational resources through both free and paid plans.
            </p>
            <div>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#FC7600] hover:text-white transition-colors"
              >
                <span>Read More About Our Mission</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* 8. Contact & Support CTA */}
        <section className="py-16 sm:py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-lg">
              <div className="inline-flex items-center gap-2 text-[#005CBF] text-xs font-bold uppercase tracking-wider">
                <MessageSquare className="w-4 h-4 text-[#FC7600]" />
                <span>Student Support</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#010E38]">
                Need Help Choosing the Right Notes?
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Have questions about specific exam modules, payments, or account access? Reach out to our dedicated support desk.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto flex-shrink-0">
              <Link
                href="/contact"
                className="w-full sm:w-auto bg-[#005CBF] hover:bg-[#004a9e] text-white text-xs font-bold px-6 py-3.5 rounded-xl shadow-lg transition-all text-center"
              >
                Contact Support Desk
              </Link>
              <Link
                href="/terms"
                className="w-full sm:w-auto bg-[#F7F9FC] hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold px-5 py-3.5 rounded-xl transition-all text-center"
              >
                Terms & Policies
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* 9. Professional Footer */}
      <Footer />
    </div>
  );
}
