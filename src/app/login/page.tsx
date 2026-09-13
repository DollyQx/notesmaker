'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { BookOpen, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

export default function StudentLoginPage() {
  const router = useRouter();
  const { loginAsStudent, loginAsAdmin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginAsStudent(email || 'student@notesmaker.in', email.split('@')[0] || 'Rahul Sharma');
    router.push('/my-notes');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-md w-full bg-white rounded-3xl border border-gray-200 shadow-xl p-8 space-y-6">
          
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white mx-auto shadow-md">
              <BookOpen className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Student Sign In</h1>
            <p className="text-xs text-gray-500">Access your purchased handwritten notes & PDF reader</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Student Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="rahul@gmail.com"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-3.5 rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
            >
              <span>Sign In to Student Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-gray-100 space-y-3 text-center">
            <p className="text-xs text-gray-500">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="font-bold text-indigo-600 hover:underline">
                Create Account
              </Link>
            </p>

            <div className="bg-amber-50 p-3 rounded-xl border border-amber-200/80 text-[11px] text-amber-900 flex items-center justify-between">
              <span>Looking for store administration?</span>
              <button
                onClick={() => { loginAsAdmin(); router.push('/admin'); }}
                className="font-bold underline text-amber-950"
              >
                Admin Login
              </button>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
