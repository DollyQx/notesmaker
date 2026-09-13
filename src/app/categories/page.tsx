'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useData } from '@/context/DataContext';
import {
  FolderTree,
  BookOpen,
  ArrowRight,
  ChevronRight,
  Layers,
  Sparkles,
  FileText,
  Search
} from 'lucide-react';

export default function StudentCategoriesPage() {
  const { categories, subcategories, notes, isLoading } = useData();
  const [selectedCatId, setSelectedCatId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Active published notes count helper
  const publishedNotes = notes.filter((n) => n.status === 'ACTIVE' || !n.status);

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-indigo-400 font-bold uppercase tracking-wider mb-2">
              <FolderTree className="w-4 h-4" />
              <span>Academic Disciplines & Branches</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Browse Notes by Category & Sub-Category
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Select your study discipline to filter handwritten notes by specialized sub-topics and exam branches.
            </p>
          </div>

          <div className="w-full md:w-80 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search category (e.g. UPSC, Engineering)..."
              className="w-full pl-9 pr-4 py-2.5 bg-slate-800 text-slate-100 placeholder-slate-400 border border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1 space-y-10">
        {isLoading ? (
          <div className="py-20 text-center space-y-3">
            <Sparkles className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
            <p className="text-xs text-gray-500 font-medium">Loading categories and sub-topics...</p>
          </div>
        ) : filteredCategories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCategories.map((cat) => {
              const catSubcategories = subcategories.filter((s) => s.categoryId === cat.id);
              const catNotesCount = publishedNotes.filter((n) => n.categoryId === cat.id).length;

              return (
                <div
                  key={cat.id}
                  className="bg-white rounded-3xl border border-gray-200 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
                >
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <span className="bg-indigo-50 text-indigo-700 border border-indigo-200/60 text-xs font-extrabold px-3 py-1 rounded-full">
                        {catNotesCount} Notes Available
                      </span>
                    </div>

                    <div>
                      <h2 className="text-lg font-extrabold text-gray-900 leading-snug">
                        {cat.name}
                      </h2>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                        {cat.description || 'Comprehensive handwritten notes and study guides for this stream.'}
                      </p>
                    </div>

                    {/* Sub-Category List Pill Grid */}
                    <div className="pt-3 border-t border-gray-100 space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                        <span className="flex items-center gap-1">
                          <Layers className="w-3.5 h-3.5 text-indigo-500" />
                          Sub-Categories ({catSubcategories.length})
                        </span>
                      </div>

                      {catSubcategories.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {catSubcategories.map((sub) => {
                            const subNoteCount = publishedNotes.filter((n) => n.subCategoryId === sub.id).length;
                            return (
                              <Link
                                key={sub.id}
                                href={`/notes?category=${cat.id}&subcategory=${sub.id}`}
                                className="group/sub bg-gray-50 hover:bg-indigo-600 text-gray-700 hover:text-white border border-gray-200 hover:border-indigo-600 text-[11px] font-semibold px-2.5 py-1.5 rounded-xl transition-all flex items-center gap-1"
                              >
                                <span>{sub.name}</span>
                                <span className="text-[10px] opacity-70 group-hover/sub:opacity-100">
                                  ({subNoteCount})
                                </span>
                              </Link>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-[11px] text-gray-400 italic">No sub-categories created yet.</p>
                      )}
                    </div>
                  </div>

                  {/* Card Footer Action */}
                  <div className="bg-gray-50 p-4 border-t border-gray-100 flex items-center justify-between text-xs">
                    <span className="text-gray-500 font-medium">Browse All Notes</span>
                    <Link
                      href={`/notes?category=${cat.id}`}
                      className="inline-flex items-center gap-1 text-indigo-600 font-bold hover:text-indigo-700 group"
                    >
                      <span>Explore Category</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center space-y-4">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto" />
            <h3 className="text-lg font-bold text-gray-900">No Categories Found</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              No categories match your search term &quot;{searchQuery}&quot;.
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
