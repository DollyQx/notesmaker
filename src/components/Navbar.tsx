'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import Logo from '@/components/Logo';
import {
  Search,
  LogOut,
  ShieldCheck,
  Menu,
  X,
  FileText,
  ChevronDown
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { categories } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoriesDropdownOpen, setIsCategoriesDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const isAdminRoute = pathname?.startsWith('/admin');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/notes?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo */}
          <Logo size="md" href="/" />

          {/* Desktop Search Bar */}
          {!isAdminRoute && (
            <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md mx-4 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search UPSC, BPSC, Govt Exam Notes..."
                className="w-full pl-10 pr-24 py-2 text-sm bg-gray-50 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#005CBF] focus:bg-white transition-all"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <button
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 bg-[#005CBF] hover:bg-[#004a9e] text-white text-xs font-semibold px-3 py-1.5 rounded-full transition-colors"
              >
                Search
              </button>
            </form>
          )}

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-gray-700">
            <Link
              href="/"
              className={`hover:text-[#005CBF] transition-colors ${pathname === '/' ? 'text-[#005CBF] font-bold' : ''}`}
            >
              Home
            </Link>

            <Link
              href="/notes"
              className={`hover:text-[#005CBF] transition-colors ${pathname === '/notes' ? 'text-[#005CBF] font-bold' : ''}`}
            >
              Browse Notes
            </Link>

            <Link
              href="/about"
              className={`hover:text-[#005CBF] transition-colors ${pathname === '/about' ? 'text-[#005CBF] font-bold' : ''}`}
            >
              About Us
            </Link>

            <Link
              href="/contact"
              className={`hover:text-[#005CBF] transition-colors ${pathname === '/contact' ? 'text-[#005CBF] font-bold' : ''}`}
            >
              Contact Us
            </Link>

            {/* Category Dropdown */}
            <div className="relative" onMouseLeave={() => setIsCategoriesDropdownOpen(false)}>
              <button
                onClick={() => setIsCategoriesDropdownOpen(!isCategoriesDropdownOpen)}
                onMouseEnter={() => setIsCategoriesDropdownOpen(true)}
                className="flex items-center gap-1 hover:text-[#005CBF] transition-colors py-2"
              >
                Categories
                <ChevronDown className="w-4 h-4" />
              </button>

              {isCategoriesDropdownOpen && (
                <div className="absolute left-0 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 mt-0 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/notes?category=${cat.id}`}
                      onClick={() => setIsCategoriesDropdownOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#005CBF] transition-colors"
                    >
                      <div className="font-semibold">{cat.name}</div>
                      <div className="text-xs text-gray-400 truncate">{cat.description}</div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {user && (
              <Link
                href="/my-notes"
                className={`flex items-center gap-1.5 hover:text-[#005CBF] transition-colors ${pathname === '/my-notes' ? 'text-[#005CBF] font-bold' : ''}`}
              >
                <FileText className="w-4 h-4 text-[#005CBF]" />
                Purchased Notes
              </Link>
            )}
          </nav>

          {/* User Auth & Admin Panel Links */}
          <div className="flex items-center gap-3">
            {/* Direct Admin Link */}
            <Link
              href="/admin"
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                user?.role === 'ADMIN'
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              <span>Admin Panel</span>
            </Link>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-100 transition-colors border border-gray-200"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#005CBF] to-[#010E38] flex items-center justify-center text-white font-bold text-xs">
                    {user.name.charAt(0)}
                  </div>
                  <span className="text-xs font-medium text-gray-800 hidden md:block max-w-[100px] truncate">
                    {user.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-500 hidden md:block" />
                </button>

                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-bold text-[#010E38]">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-[#005CBF] uppercase">
                        {user.role}
                      </span>
                    </div>

                    {user.role === 'ADMIN' ? (
                      <>
                        <Link
                          href="/admin"
                          onClick={() => setIsUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-amber-700 hover:bg-amber-50 font-semibold"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          Admin Dashboard
                        </Link>
                        <Link
                          href="/admin/notes"
                          onClick={() => setIsUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                        >
                          <FileText className="w-4 h-4 text-blue-600" />
                          Manage Notes
                        </Link>
                        <Link
                          href="/admin/categories"
                          onClick={() => setIsUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                        >
                          <span>📁</span> Categories
                        </Link>
                        <Link
                          href="/admin/students"
                          onClick={() => setIsUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                        >
                          <span>👥</span> Students
                        </Link>
                        <Link
                          href="/admin/purchases"
                          onClick={() => setIsUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                        >
                          <span>💳</span> Purchases
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/my-notes"
                          onClick={() => setIsUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#005CBF]"
                        >
                          <FileText className="w-4 h-4 text-[#005CBF]" />
                          My Library (Purchased)
                        </Link>
                        <Link
                          href="/notes"
                          onClick={() => setIsUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#005CBF]"
                        >
                          <span>📚</span> Browse Notes
                        </Link>
                        <Link
                          href="/about"
                          onClick={() => setIsUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#005CBF]"
                        >
                          <span>ℹ️</span> About Us
                        </Link>
                        <Link
                          href="/contact"
                          onClick={() => setIsUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#005CBF]"
                        >
                          <span>✉️</span> Contact Support
                        </Link>
                      </>
                    )}

                    <div className="border-t border-gray-100 my-1 pt-1">
                      <button
                        onClick={async () => {
                          await logout();
                          setIsUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="text-xs font-semibold text-gray-700 hover:text-[#005CBF] px-3 py-2 rounded-lg transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="bg-[#FC7600] hover:bg-[#e06900] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs transition-colors"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4 space-y-3 animate-in slide-in-from-top-2">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes..."
                className="w-full pl-9 pr-4 py-2 text-sm bg-gray-100 border border-gray-200 rounded-lg"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </form>

            <div className="flex flex-col space-y-2 text-sm font-medium pt-2">
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
              >
                Home
              </Link>
              <Link
                href="/notes"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
              >
                Browse All Notes
              </Link>
              <Link
                href="/about"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
              >
                About Us
              </Link>
              <Link
                href="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
              >
                Contact Us
              </Link>
              {user && (
                <Link
                  href="/my-notes"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 flex items-center justify-between"
                >
                  <span>Purchased Notes</span>
                  <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded-full font-bold">My Library</span>
                </Link>
              )}
              <Link
                href="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 font-semibold flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                Admin Dashboard
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
