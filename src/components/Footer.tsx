'use client';

import React from 'react';
import Link from 'next/link';
import Logo from '@/components/Logo';
import { ShieldCheck, DownloadCloud, Award, Lock, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#010E38] text-slate-300 pt-12 pb-8 border-t border-[#005CBF]/30 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Value Props Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-10 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#005CBF]/15 text-[#0071D1] flex items-center justify-center border border-[#005CBF]/30">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Topper Curated</h4>
              <p className="text-xs text-slate-400">Handwritten by top rankers</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FC7600]/15 text-[#FC7600] flex items-center justify-center border border-[#FC7600]/30">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Secure Access</h4>
              <p className="text-xs text-slate-400">Instant PDF & text web reader</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Verified Content</h4>
              <p className="text-xs text-slate-400">100% curriculum aligned</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#005CBF]/15 text-[#0071D1] flex items-center justify-center border border-[#005CBF]/30">
              <DownloadCloud className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Lifetime Access</h4>
              <p className="text-xs text-slate-400">Read anywhere on your device</p>
            </div>
          </div>
        </div>

        {/* Footer Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-10">
          <div className="space-y-4 md:col-span-1">
            <Logo variant="dark" size="md" showTagline={true} />
            <p className="text-xs text-slate-400 leading-relaxed">
              India&apos;s digital study notes marketplace for UPSC, BPSC, State PCS & competitive examination aspirants.
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
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Quick Links</h5>
            <ul className="space-y-2 text-xs">
              <li><Link href="/" className="hover:text-blue-400 transition-colors">Home</Link></li>
              <li><Link href="/notes" className="hover:text-blue-400 transition-colors">Browse Notes</Link></li>
              <li><Link href="/about" className="hover:text-blue-400 transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-blue-400 transition-colors">Contact Us</Link></li>
              <li><Link href="/terms" className="hover:text-blue-400 transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Student Support</h5>
            <p className="text-xs text-slate-400 mb-2">Have a question or request notes?</p>
            <a href="mailto:support@notesstudy.online" className="inline-block bg-slate-800 hover:bg-slate-700 text-indigo-400 text-xs font-semibold px-3 py-2 rounded-lg border border-slate-700 transition-colors">
              support@notesstudy.online
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-center sm:text-left">
            © 2026 Notes Study · Developed by{' '}
            <a
              href="https://wa.me/917982683218"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contact DollyQx on WhatsApp"
              className="text-slate-200 hover:text-white underline underline-offset-2 decoration-slate-600 hover:decoration-white transition-colors font-medium"
            >
              DollyQx
            </a>{' '}
            · GM Code Lab
          </p>
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
