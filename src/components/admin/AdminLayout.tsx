'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  FolderTree,
  Tags,
  FileText,
  Users,
  ShoppingCart,
  ShieldCheck,
  LogOut,
  ArrowLeft,
  Menu,
  X,
  Plus,
  Sparkles,
  Lock
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  actionButton?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
}

export default function AdminLayout({
  children,
  title,
  subtitle,
  actionButton
}: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loginAsAdmin, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Security check: Guard admin routes
  const isAdmin = user?.role === 'admin';

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Categories', href: '/admin/categories', icon: FolderTree },
    { label: 'Sub-Categories', href: '/admin/subcategories', icon: Tags },
    { label: 'Notes Library', href: '/admin/notes', icon: FileText },
    { label: 'Students', href: '/admin/students', icon: Users },
    { label: 'Orders & Sales', href: '/admin/purchases', icon: ShoppingCart }
  ];

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-3xl p-8 text-center text-white shadow-2xl space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Admin Authentication Required</h2>
            <p className="text-xs text-slate-400 mt-2">
              You must be logged in as an Administrator to access the store management dashboard.
            </p>
          </div>
          <div className="space-y-3 pt-2">
            <button
              onClick={() => loginAsAdmin()}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Login as Admin (Demo Access)</span>
            </button>

            <Link
              href="/"
              className="w-full block bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-medium py-3 rounded-xl transition-colors"
            >
              Return to Student Panel
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-extrabold text-base text-white tracking-tight">Admin Portal</h1>
                <span className="text-[10px] text-slate-400 font-mono">NotesMaker v1.0</span>
              </div>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 text-xs text-indigo-400 hover:bg-indigo-950/40 rounded-xl border border-indigo-900/50 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Switch to Student Website</span>
          </Link>

          <div className="pt-2 flex items-center justify-between text-xs text-slate-400 px-2">
            <div className="flex items-center gap-2 truncate">
              <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-xs">
                A
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-slate-200 truncate">{user?.name}</p>
                <p className="text-[10px] text-slate-500">Administrator</p>
              </div>
            </div>
            <button
              onClick={() => logout()}
              className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-red-400 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Body */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar Header */}
        <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">{title}</h2>
              {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
            </div>
          </div>

          {actionButton && (
            <button
              onClick={actionButton.onClick}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-600/20 flex items-center gap-2 transition-all"
            >
              {actionButton.icon || <Plus className="w-4 h-4" />}
              <span>{actionButton.label}</span>
            </button>
          )}
        </header>

        {/* Page Children Container */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
