'use client';

import React, { useState, useEffect } from 'react';
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
  LogOut,
  ShieldCheck,
  Menu,
  X,
  BookOpen,
  ChevronRight,
  AlertCircle,
  Loader2
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
  const { user, logout, isLoading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/admin/login');
      } else if (user.role !== 'ADMIN') {
        setIsVerifying(false);
      } else {
        setIsVerifying(false);
      }
    }
  }, [user, isLoading, router]);

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Categories', href: '/admin/categories', icon: FolderTree },
    { label: 'Sub-Categories', href: '/admin/subcategories', icon: Tags },
    { label: 'Notes Library', href: '/admin/notes', icon: FileText },
    { label: 'Students', href: '/admin/students', icon: Users },
    { label: 'Orders & Sales', href: '/admin/purchases', icon: ShoppingCart }
  ];

  if (isLoading || isVerifying) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 text-amber-500 animate-spin mx-auto" />
          <p className="text-xs font-mono text-slate-400">Verifying Server-Side Admin Privileges...</p>
        </div>
      </div>
    );
  }

  if (user && user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4 text-center">
        <div className="max-w-md bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-4 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 text-red-400 border border-red-500/20 flex items-center justify-center mx-auto">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-extrabold text-white">403 Access Forbidden</h2>
          <p className="text-xs text-slate-400">
            Your account ({user.email}) has role <strong className="text-amber-400">{user.role}</strong>. Only administrator accounts can access the store management system.
          </p>
          <div className="pt-2 flex gap-3">
            <button
              onClick={async () => {
                await logout();
                router.push('/admin/login');
              }}
              className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs py-3 rounded-xl transition-colors"
            >
              Sign In as Admin
            </button>
            <Link
              href="/"
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs py-3 rounded-xl transition-colors inline-block"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col md:flex-row">
      
      {/* Mobile Top Navbar Header */}
      <div className="md:hidden bg-slate-900 border-b border-slate-800 p-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-sm text-white">NotesMaker Admin</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-xl bg-slate-800 text-slate-300"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Admin Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 z-40 h-screen w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col justify-between transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-8">
          
          {/* Logo Header */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-extrabold shadow-lg">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-extrabold text-sm text-white tracking-tight">NotesMaker</h2>
              <p className="text-[10px] text-amber-400 font-mono font-bold">Admin Console</p>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Admin Profile & Actions */}
        <div className="pt-4 border-t border-slate-800/80 space-y-3">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <p className="text-xs font-bold text-white truncate">{user?.name || 'Administrator'}</p>
            <p className="text-[10px] text-slate-500 truncate font-mono">{user?.email}</p>
            <div className="pt-1 flex items-center gap-1 text-[9px] font-bold text-amber-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>SUPER ADMIN VERIFIED</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Link
              href="/"
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-bold py-2 rounded-xl text-center flex items-center justify-center gap-1"
            >
              <BookOpen className="w-3.5 h-3.5" /> Store
            </Link>
            <button
              onClick={async () => {
                await logout();
                router.push('/admin/login');
              }}
              className="p-2 bg-slate-800 hover:bg-red-900/40 text-slate-400 hover:text-red-400 rounded-xl transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
        
        {/* Page Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">{title}</h1>
            {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
          </div>

          {actionButton && (
            <button
              onClick={actionButton.onClick}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs px-4 py-3 rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2 self-start sm:self-auto"
            >
              {actionButton.icon}
              <span>{actionButton.label}</span>
            </button>
          )}
        </div>

        {/* Page Body */}
        <div>{children}</div>
      </main>

    </div>
  );
}
