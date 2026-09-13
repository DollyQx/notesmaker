'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import NoteCard from '@/components/NoteCard';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  BookOpen,
  ArrowUpDown,
  Sparkles,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';

function NotesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { notes, categories, subcategories, isLoading } = useData();

  const paramCategory = searchParams.get('category') || 'all';
  const paramSubCategory = searchParams.get('subcategory') || 'all';
  const paramSearch = searchParams.get('search') || '';

  const [selectedCategory, setSelectedCategory] = useState<string>(paramCategory);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>(paramSubCategory);
  const [searchTerm, setSearchTerm] = useState<string>(paramSearch);
  const [priceFilter, setPriceFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('popular');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  // Sync state if URL query parameters change
  useEffect(() => {
    if (searchParams.get('category')) setSelectedCategory(searchParams.get('category')!);
    if (searchParams.get('subcategory')) setSelectedSubCategory(searchParams.get('subcategory')!);
    if (searchParams.get('search') !== null) setSearchTerm(searchParams.get('search')!);
  }, [searchParams]);

  // CRITICAL SECURITY RULE: Filter out unpublished notes for students
  const publishedNotes = useMemo(() => {
    return notes.filter((n) => {
      // If user is ADMIN, show all notes. Otherwise, only ACTIVE notes.
      if (user?.role === 'ADMIN') return true;
      return n.status === 'ACTIVE' || !n.status;
    });
  }, [notes, user]);

  // Subcategories filtered by selected parent category
  const availableSubCategories = useMemo(() => {
    if (selectedCategory === 'all') return subcategories;
    return subcategories.filter(s => s.categoryId === selectedCategory);
  }, [subcategories, selectedCategory]);

  // Main filter pipeline
  const filteredNotes = useMemo(() => {
    return publishedNotes.filter(note => {
      // Category filter
      if (selectedCategory !== 'all' && note.categoryId !== selectedCategory) {
        return false;
      }
      // Subcategory filter
      if (selectedSubCategory !== 'all' && note.subCategoryId !== selectedSubCategory) {
        return false;
      }
      // Search term filter
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase().trim();
        const matchesTitle = note.title.toLowerCase().includes(query);
        const matchesDesc = note.description.toLowerCase().includes(query);
        const matchesAuthor = note.author.toLowerCase().includes(query);
        const matchesCategory = note.categoryName.toLowerCase().includes(query);
        const matchesSub = note.subCategoryName?.toLowerCase().includes(query);
        const matchesTags = note.tags?.some(t => t.toLowerCase().includes(query));
        if (!matchesTitle && !matchesDesc && !matchesAuthor && !matchesCategory && !matchesSub && !matchesTags) {
          return false;
        }
      }
      // Price filter
      if (priceFilter === 'under150' && note.price >= 150) return false;
      if (priceFilter === '150to200' && (note.price < 150 || note.price > 200)) return false;
      if (priceFilter === 'above200' && note.price <= 200) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      }
      if (sortBy === 'popular') return (b.salesCount || 0) - (a.salesCount || 0);
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      return 0;
    });
  }, [publishedNotes, selectedCategory, selectedSubCategory, searchTerm, priceFilter, sortBy]);

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setSelectedSubCategory('all');
    setSearchTerm('');
    setPriceFilter('all');
    setSortBy('popular');
    router.push('/notes');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-indigo-400 font-bold uppercase tracking-wider mb-2">
              <BookOpen className="w-4 h-4" />
              <span>Student Notes Marketplace</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Explore Published Handwritten Digital Notes
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Instant access to high-yield notes, mind maps, and pyq solutions. Read securely in online PDF viewer.
            </p>
          </div>

          {/* Quick Search */}
          <div className="w-full md:w-80 relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search title, subject, author..."
              className="w-full pl-9 pr-4 py-2.5 bg-slate-800 text-slate-100 placeholder-slate-400 border border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0 space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-6">
              
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2 font-bold text-gray-900 text-sm">
                  <Filter className="w-4 h-4 text-indigo-600" />
                  <span>Filter Notes</span>
                </div>
                {(selectedCategory !== 'all' || selectedSubCategory !== 'all' || searchTerm || priceFilter !== 'all') && (
                  <button
                    onClick={clearAllFilters}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">
                  Category
                </label>
                <div className="space-y-1">
                  <button
                    onClick={() => { setSelectedCategory('all'); setSelectedSubCategory('all'); }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                      selectedCategory === 'all'
                        ? 'bg-indigo-50 text-indigo-700 font-bold'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    All Categories ({publishedNotes.length})
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => { setSelectedCategory(cat.id); setSelectedSubCategory('all'); }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors flex justify-between items-center ${
                        selectedCategory === cat.id
                          ? 'bg-indigo-50 text-indigo-700 font-bold'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span className="truncate">{cat.name}</span>
                      <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">
                        {publishedNotes.filter(n => n.categoryId === cat.id).length}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sub-Category Filter */}
              {availableSubCategories.length > 0 && (
                <div className="pt-3 border-t border-gray-100">
                  <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">
                    Sub-Category
                  </label>
                  <select
                    value={selectedSubCategory}
                    onChange={(e) => setSelectedSubCategory(e.target.value)}
                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="all">All Sub-Categories</option>
                    {availableSubCategories.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Price Filter */}
              <div className="pt-3 border-t border-gray-100">
                <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">
                  Price Range
                </label>
                <div className="space-y-1 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer p-1.5 hover:bg-gray-50 rounded-lg">
                    <input
                      type="radio"
                      name="price"
                      checked={priceFilter === 'all'}
                      onChange={() => setPriceFilter('all')}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>All Prices</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer p-1.5 hover:bg-gray-50 rounded-lg">
                    <input
                      type="radio"
                      name="price"
                      checked={priceFilter === 'under150'}
                      onChange={() => setPriceFilter('under150')}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>Under ₹150</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer p-1.5 hover:bg-gray-50 rounded-lg">
                    <input
                      type="radio"
                      name="price"
                      checked={priceFilter === '150to200'}
                      onChange={() => setPriceFilter('150to200')}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>₹150 - ₹200</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer p-1.5 hover:bg-gray-50 rounded-lg">
                    <input
                      type="radio"
                      name="price"
                      checked={priceFilter === 'above200'}
                      onChange={() => setPriceFilter('above200')}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>Above ₹200</span>
                  </label>
                </div>
              </div>

            </div>
          </aside>

          {/* Main Results Area */}
          <main className="flex-1 space-y-6">
            
            {/* Sort Controls Bar */}
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-600">
                <span>Showing <strong className="text-gray-900">{filteredNotes.length}</strong> notes</span>
                {searchTerm && (
                  <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md text-[11px] font-bold">
                    &quot;{searchTerm}&quot;
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="lg:hidden flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold px-3 py-2 rounded-xl transition-colors"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>Filters</span>
                </button>

                <div className="flex items-center gap-2 text-xs">
                  <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-gray-500 hidden sm:inline font-medium">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="popular">Most Popular</option>
                    <option value="newest">Newest First</option>
                    <option value="rating">Highest Rated</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Notes Grid or Skeleton Loading */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((idx) => (
                  <div key={idx} className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4 animate-pulse">
                    <div className="h-32 bg-gray-200 rounded-xl" />
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                    <div className="h-8 bg-gray-200 rounded-xl pt-2" />
                  </div>
                ))}
              </div>
            ) : filteredNotes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredNotes.map((note) => (
                  <NoteCard key={note.id} note={note} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center space-y-4 shadow-sm">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">No matching published notes found</h3>
                <p className="text-xs text-gray-500 max-w-md mx-auto">
                  We couldn&apos;t find any notes matching your search or filters. Try resetting filters or searching for another subject.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-colors shadow-xs"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setIsMobileFilterOpen(false)} />
          <div className="relative ml-auto w-full max-w-xs bg-white h-full p-6 overflow-auto shadow-2xl flex flex-col justify-between z-10">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="font-bold text-gray-900 text-base">Filter Notes</h3>
                <button onClick={() => setIsMobileFilterOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => { setSelectedCategory(e.target.value); setSelectedSubCategory('all'); }}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                >
                  <option value="all">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Price Range</label>
                <select
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                >
                  <option value="all">All Prices</option>
                  <option value="under150">Under ₹150</option>
                  <option value="150to200">₹150 - ₹200</option>
                  <option value="above200">Above ₹200</option>
                </select>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 space-y-2">
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full bg-indigo-600 text-white font-bold text-xs py-3 rounded-xl"
              >
                Apply Filters ({filteredNotes.length})
              </button>
              <button
                onClick={clearAllFilters}
                className="w-full bg-gray-100 text-gray-700 font-semibold text-xs py-2.5 rounded-xl"
              >
                Reset All
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default function NotesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-2">
          <Sparkles className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
          <p className="text-xs font-medium text-gray-500">Loading Notes Marketplace...</p>
        </div>
      </div>
    }>
      <NotesContent />
    </Suspense>
  );
}
