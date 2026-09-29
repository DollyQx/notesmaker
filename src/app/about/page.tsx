'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Logo from '@/components/Logo';
import {
  BookOpen,
  Award,
  Target,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Users,
  ArrowRight,
  GraduationCap,
  FileCheck
} from 'lucide-react';

export default function AboutUsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9FC] text-slate-900">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-[#010E38] to-[#002B66] text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#FC7600_1px,transparent_1px)] [background-size:16px_16px]" />
          
          <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 text-blue-300 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#FC7600]" />
              <span>About Notes Study</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Empowering Aspirants to <br className="hidden sm:inline" />
              <span className="text-[#FC7600]">Learn, Practice & Grow</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Notes Study is an educational platform dedicated to helping students prepare for competitive examinations such as UPSC, BPSC, and other government exams.
            </p>
          </div>
        </section>

        {/* Mission Statement Card */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-200 space-y-6">
            <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#005CBF] flex items-center justify-center border border-blue-100 flex-shrink-0">
                <Target className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#FC7600]">
                  Our Platform Mission
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-[#010E38]">
                  Making Quality Education Accessible & Affordable
                </h2>
              </div>
            </div>

            <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
              Our mission is to provide high-quality study notes, mock tests, test series, answer writing material, and PDF resources through both free and paid plans, making quality education accessible and affordable for every student.
            </p>

            <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
              We are committed to supporting students with reliable learning resources for effective exam preparation.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#F7F9FC]">
                <CheckCircle2 className="w-5 h-5 text-[#005CBF] flex-shrink-0 mt-0.5" />
                <span className="text-xs font-semibold text-slate-800">
                  Reliable topper-verified notes
                </span>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#F7F9FC]">
                <CheckCircle2 className="w-5 h-5 text-[#FC7600] flex-shrink-0 mt-0.5" />
                <span className="text-xs font-semibold text-slate-800">
                  Affordable plans with instant access
                </span>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#F7F9FC]">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span className="text-xs font-semibold text-slate-800">
                  Secure, distraction-free reader
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Competitive Exams Focus */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="text-center space-y-3 mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#005CBF]">
              Comprehensive Coverage
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#010E38]">
              Target Examinations We Support
            </h2>
            <p className="text-sm text-slate-600 max-w-xl mx-auto">
              Our curated study material is structured specifically around the syllabus and question patterns of premier government examinations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-[#005CBF] transition-all group">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#005CBF] flex items-center justify-center font-bold text-lg mb-4 group-hover:bg-[#005CBF] group-hover:text-white transition-colors">
                UPSC
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">UPSC Civil Services</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Prelims GS 1 & 2, Mains GS 1-4, Essay frameworks, and current affairs compilations.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-[#FC7600] transition-all group">
              <div className="w-12 h-12 rounded-xl bg-orange-50 text-[#FC7600] flex items-center justify-center font-bold text-lg mb-4 group-hover:bg-[#FC7600] group-hover:text-white transition-colors">
                BPSC
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">BPSC State Services</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Integrated Bihar special history, geography, economy, polity, and mains answer blueprints.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-[#005CBF] transition-all group">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#005CBF] flex items-center justify-center font-bold text-lg mb-4 group-hover:bg-[#005CBF] group-hover:text-white transition-colors">
                UPPSC
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">UPPSC PCS</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Comprehensive state GK, GS modules, standard notes, and practice question banks.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-[#FC7600] transition-all group">
              <div className="w-12 h-12 rounded-xl bg-orange-50 text-[#FC7600] flex items-center justify-center font-bold text-lg mb-4 group-hover:bg-[#FC7600] group-hover:text-white transition-colors">
                BSSC
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">BSSC & State Exams</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                General awareness, quantitative reasoning, and syllabus-targeted revision handbooks.
              </p>
            </div>
          </div>
        </section>

        {/* Why Choose Notes Study */}
        <section className="bg-white border-y border-slate-200 py-16 sm:py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-3 mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FC7600]">
                Why Aspirants Trust Us
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#010E38]">
                Built by Students, Designed for Rankers
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 rounded-2xl bg-[#F7F9FC] border border-slate-200 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#005CBF] text-white flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Topper-Curated Content</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Synthesized from standard textbooks, toppers' handwritten notes, and official exam trends to save months of unstructured reading.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#F7F9FC] border border-slate-200 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#FC7600] text-white flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Instant & Secure Access</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Read directly in our web-based digital reader without complex app installs or delays. Unlocked instantaneously after checkout.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#F7F9FC] border border-slate-200 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#010E38] text-white flex items-center justify-center">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Affordable For Everyone</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Quality study notes should never be a financial hurdle. Our materials are priced transparently for competitive aspirants across India.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#010E38]">
            Start Preparing Smarter Today
          </h2>
          <p className="text-sm text-slate-600 max-w-lg mx-auto">
            Explore our curated library of competitive exam notes or reach out to our support team for syllabus advice.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/notes"
              className="inline-flex items-center gap-2 bg-[#FC7600] hover:bg-[#e06900] text-white text-xs font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-orange-500/20 transition-all"
            >
              <span>Browse All Notes</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-[#005CBF] border border-[#005CBF]/30 text-xs font-bold px-6 py-3.5 rounded-xl transition-all"
            >
              <span>Contact Support</span>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
