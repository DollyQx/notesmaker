'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Logo from '@/components/Logo';
import { useAuth } from '@/context/AuthContext';
import { Lock, Mail, ArrowRight, AlertCircle, Loader2, ShieldCheck, KeyRound, CheckCircle2 } from 'lucide-react';

export default function StudentLoginPage() {
  const router = useRouter();
  const { login, verifyDevice } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Device verification state (for 2nd device login)
  const [requiresVerification, setRequiresVerification] = useState(false);
  const [deviceId, setDeviceId] = useState('');
  const [emailMasked, setEmailMasked] = useState('');
  const [otp, setOtp] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(true);

    const res = await login(email, password);
    setIsSubmitting(false);

    if (res.requiresVerification) {
      setRequiresVerification(true);
      setDeviceId(res.deviceId || '');
      setEmailMasked(res.emailMasked || email);
      setSuccessMsg(res.message || 'Please check your email for the 6-digit device verification code.');
      return;
    }

    if (res.success) {
      router.push('/my-notes');
    } else {
      setErrorMsg(res.error || 'Invalid email or password');
    }
  };

  const handleVerifyDevice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim() || otp.trim().length !== 6) {
      setErrorMsg('Please enter the 6-digit verification code.');
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);

    const res = await verifyDevice(email, otp.trim(), deviceId);
    setIsSubmitting(false);

    if (res.success) {
      router.push('/my-notes');
    } else {
      setErrorMsg(res.error || 'Device verification failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9FC]">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-md w-full bg-white rounded-3xl border border-[#E2E8F0] shadow-xl p-8 space-y-6">
          
          {/* Brand Header */}
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <Logo size="lg" showText={false} />
            </div>
            <h1 className="text-2xl font-black text-[#010E38] tracking-tight">
              {requiresVerification ? 'Authorize New Device' : 'Student Sign In'}
            </h1>
            <p className="text-xs text-slate-500">
              {requiresVerification
                ? `Enter the 6-digit code sent to ${emailMasked}`
                : 'Access your purchased competitive exam notes & secure reader'}
            </p>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-600" />
              <span className="leading-relaxed">{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-[#005CBF] text-xs font-semibold flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#005CBF]" />
              <span className="leading-relaxed">{successMsg}</span>
            </div>
          )}

          {requiresVerification ? (
            /* Second Device Verification Form */
            <form onSubmit={handleVerifyDevice} className="space-y-5">
              <div className="bg-[#F7F9FC] border border-[#005CBF]/30 p-4 rounded-2xl text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-[#005CBF]/10 text-[#005CBF] flex items-center justify-center mx-auto">
                  <KeyRound className="w-5 h-5" />
                </div>
                <h3 className="text-xs font-bold text-[#010E38]">Security Policy Check</h3>
                <p className="text-[11px] text-slate-500 leading-normal">
                  To protect your purchased notes, new device logins require email authorization. You can authorize up to 2 devices in a 48-hour period.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#010E38] uppercase tracking-wider mb-1.5">
                  6-Digit Verification Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  autoFocus
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  className="w-full text-center tracking-[8px] font-mono text-xl py-3 bg-[#F7F9FC] border border-gray-300 rounded-xl text-[#010E38] font-bold focus:outline-none focus:ring-2 focus:ring-[#005CBF] focus:bg-white"
                />
              </div>

              <div className="space-y-2 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || otp.length !== 6}
                  className="w-full bg-[#005CBF] hover:bg-[#004a9e] text-white font-bold text-xs py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Authorize This Device</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setRequiresVerification(false);
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                  className="w-full py-2.5 text-xs text-slate-500 hover:text-slate-800 font-semibold transition-colors"
                >
                  Back to Sign In
                </button>
              </div>
            </form>
          ) : (
            /* Normal Login Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Registered Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@example.com"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#005CBF] focus:bg-white"
                  />
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#005CBF] focus:bg-white"
                  />
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <span className="flex items-center gap-1.5 text-[11px] text-slate-600">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Stay logged in until sign out</span>
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#005CBF] hover:bg-[#004a9e] text-white font-bold text-xs py-3.5 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Sign In to Student Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          <div className="text-center pt-2 border-t border-gray-100">
            <p className="text-xs text-slate-500">
              New to Notes Study?{' '}
              <Link href="/register" className="text-[#005CBF] hover:underline font-bold">
                Create Free Account
              </Link>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
