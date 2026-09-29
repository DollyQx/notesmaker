'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Mail,
  Phone,
  MessageSquare,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  HelpCircle,
  Clock,
  MapPin
} from 'lucide-react';

export default function ContactUsPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!name.trim() || !email.trim() || !mobile.trim() || !subject.trim() || !description.trim()) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          mobile: mobile.trim(),
          subject: subject.trim(),
          description: description.trim()
        })
      });

      const data = await res.json();

      if (data.success) {
        setSuccessMsg(data.message || 'Your enquiry has been successfully delivered! We will get back to you shortly.');
        setName('');
        setEmail('');
        setMobile('');
        setSubject('');
        setDescription('');
      } else {
        setErrorMsg(data.error || 'Failed to send message. Please try again.');
      }
    } catch (err: any) {
      setErrorMsg('Network error while sending message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9FC] text-slate-900">
      <Navbar />

      <main className="flex-1 py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-12">
          
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-[#005CBF] px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
              <MessageSquare className="w-3.5 h-3.5 text-[#FC7600]" />
              <span>We are here to help</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-[#010E38] tracking-tight">
              Contact Notes Study Support
            </h1>
            <p className="text-sm text-slate-500 max-w-xl mx-auto">
              Have questions regarding notes, syllabus coverage, account verification, or payment? Submit your query and our team will get back to you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Info Column */}
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
                <h3 className="font-extrabold text-base text-[#010E38]">
                  Support & Queries
                </h3>

                <div className="space-y-4 text-xs text-slate-600">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#005CBF] flex items-center justify-center flex-shrink-0">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block">Response Window</span>
                      <span>Usually within 24 to 48 hours for student queries.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#FC7600] flex items-center justify-center flex-shrink-0">
                      <HelpCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block">Digital Orders</span>
                      <span>Instant unlocking via official checkout. No offline centers.</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#F7F9FC] border border-slate-200 text-[11px] text-slate-500 space-y-1">
                  <span className="font-bold text-slate-700 block">Notice:</span>
                  <span>Please provide your active registered email address and WhatsApp/mobile number so we can reach you quickly.</span>
                </div>
              </div>
            </div>

            {/* Right Contact Form Column */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-[#010E38]">Send an Enquiry</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Fill out the form below with complete details.
                  </p>
                </div>

                {successMsg && (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-emerald-900">Message Delivered!</p>
                      <p className="mt-0.5 text-emerald-700">{successMsg}</p>
                    </div>
                  </div>
                )}

                {errorMsg && (
                  <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Rahul Kumar"
                        className="w-full px-3.5 py-2.5 bg-[#F7F9FC] border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#005CBF]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Registered Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="student@example.com"
                        className="w-full px-3.5 py-2.5 bg-[#F7F9FC] border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#005CBF]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Mobile Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        placeholder="e.g. +91 9876543210"
                        className="w-full px-3.5 py-2.5 bg-[#F7F9FC] border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#005CBF]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Subject / Topic *
                      </label>
                      <input
                        type="text"
                        required
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="e.g. UPSC Mains Notes Enquiry"
                        className="w-full px-3.5 py-2.5 bg-[#F7F9FC] border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#005CBF]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Problem or Question / Description *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Please describe your question or issue in detail..."
                      className="w-full px-3.5 py-2.5 bg-[#F7F9FC] border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#005CBF] leading-relaxed"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#005CBF] hover:bg-[#004a9e] text-white font-bold text-xs py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending Enquiry...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Message</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
