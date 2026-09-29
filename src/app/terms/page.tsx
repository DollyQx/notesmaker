'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  FileText,
  Mail,
  CreditCard,
  AlertTriangle,
  ShieldCheck,
  CheckCircle,
  HelpCircle
} from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9FC] text-slate-900">
      <Navbar />

      <main className="flex-1 py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-[#005CBF] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Official Policies</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-[#010E38] tracking-tight">
              Terms & Conditions – Notes Study
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Please read these standard terms carefully before enrolling or purchasing any notes on our platform.
            </p>
          </div>

          {/* Main Card with the 3 Sections */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl space-y-8">
            
            {/* Section 1 */}
            <div className="space-y-3 pb-8 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#005CBF] border border-blue-200 flex items-center justify-center font-black text-sm flex-shrink-0">
                  1
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Registration & Verification
                  </span>
                  <h2 className="text-lg sm:text-xl font-bold text-[#010E38]">
                    Authentic Email
                  </h2>
                </div>
              </div>
              <div className="pl-13 text-sm text-slate-700 leading-relaxed space-y-2">
                <p>
                  All students must register and log in using their own valid email address. Notes Study will not be responsible for issues caused by an incorrect or fake email.
                </p>
                <p className="text-xs text-slate-500">
                  Account verification codes, security alerts, and digital purchase receipts are transmitted strictly to your registered email address.
                </p>
              </div>
            </div>

            {/* Section 2 */}
            <div className="space-y-3 pb-8 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#FC7600] border border-orange-200 flex items-center justify-center font-black text-sm flex-shrink-0">
                  2
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Payment Security
                  </span>
                  <h2 className="text-lg sm:text-xl font-bold text-[#010E38]">
                    Official Payments Only
                  </h2>
                </div>
              </div>
              <div className="pl-13 text-sm text-slate-700 leading-relaxed space-y-2">
                <p>
                  Notes Study has no offline center and no authorized agent. All payments must be made only through our official website.
                </p>
                <p className="text-xs text-slate-500">
                  Do not make payments to any individual claiming to represent Notes Study outside of our verified website checkout.
                </p>
              </div>
            </div>

            {/* Section 3 */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 border border-red-200 flex items-center justify-center font-black text-sm flex-shrink-0">
                  3
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Policy on Purchases
                  </span>
                  <h2 className="text-lg sm:text-xl font-bold text-[#010E38]">
                    No Refund Policy
                  </h2>
                </div>
              </div>
              <div className="pl-13 text-sm text-slate-700 leading-relaxed space-y-2">
                <p>
                  Once a payment is successfully completed, it is non-refundable. Students are advised to verify all course details and make the payment only after full satisfaction.
                </p>
                <p className="text-xs text-slate-500">
                  Since digital notes and educational materials are unlocked instantaneously upon successful payment, transactions cannot be reversed or refunded.
                </p>
              </div>
            </div>

          </div>

          {/* Need Help Box */}
          <div className="bg-slate-100 rounded-2xl p-6 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white text-[#005CBF] shadow-xs">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Have questions about our terms?</h4>
                <p className="text-[11px] text-slate-500">Our support desk is available to assist you.</p>
              </div>
            </div>
            <Link
              href="/contact"
              className="bg-[#005CBF] hover:bg-[#004a9e] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap"
            >
              Contact Support Desk
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
