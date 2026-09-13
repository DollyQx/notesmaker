'use client';

import React from 'react';
import Link from 'next/link';
import { Note } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { Star, FileText, CheckCircle2, ArrowRight, UserCheck, BookOpen } from 'lucide-react';

interface NoteCardProps {
  note: Note;
}

export default function NoteCard({ note }: NoteCardProps) {
  const { hasPurchased } = useAuth();
  const isPurchased = hasPurchased(note.id);

  const discount = note.originalPrice
    ? Math.round(((note.originalPrice - note.price) / note.originalPrice) * 100)
    : null;

  return (
    <div className="group bg-white rounded-2xl border border-gray-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden relative">
      
      {/* Top Banner / Subject Icon Placeholder */}
      <div className="h-36 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-800 p-4 flex flex-col justify-between relative overflow-hidden">
        {/* Background Decorative Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />
        
        <div className="flex items-center justify-between relative z-10">
          <span className="bg-white/10 backdrop-blur-md border border-white/20 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full truncate max-w-[180px]">
            {note.categoryName}
          </span>

          <div className="flex items-center gap-1">
            {note.isBestseller && (
              <span className="bg-amber-400 text-amber-950 text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-xs uppercase tracking-wider">
                Bestseller
              </span>
            )}
            {note.featured && !note.isBestseller && (
              <span className="bg-indigo-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-xs uppercase tracking-wider">
                Featured
              </span>
            )}
          </div>
        </div>

        <div className="relative z-10 flex items-end justify-between">
          <div className="flex items-center gap-2 text-white/90">
            <div className="p-2 rounded-lg bg-white/10 border border-white/15">
              <FileText className="w-5 h-5 text-indigo-300" />
            </div>
            <div>
              <p className="text-[11px] text-white/70 font-medium">{note.subCategoryName}</p>
              <p className="text-xs font-semibold text-white">{note.pages} Pages • PDF</p>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-black/40 backdrop-blur-xs px-2 py-1 rounded-md text-amber-300 text-xs font-bold border border-white/10">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{note.rating}</span>
            <span className="text-[10px] text-white/60">({note.reviewsCount})</span>
          </div>
        </div>
      </div>

      {/* Main Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <Link href={`/notes/${note.id}`} className="block group-hover:text-indigo-600 transition-colors">
            <h3 className="font-bold text-gray-900 text-base leading-snug line-clamp-2 mb-2">
              {note.title}
            </h3>
          </Link>

          <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-4">
            {note.description}
          </p>

          <div className="flex items-center gap-2 text-xs text-gray-500 mb-4 bg-gray-50 p-2 rounded-lg border border-gray-100">
            <UserCheck className="w-4 h-4 text-indigo-600 flex-shrink-0" />
            <span className="truncate font-medium text-gray-700">{note.author}</span>
            {note.institute && (
              <span className="text-[10px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded font-semibold flex-shrink-0">
                {note.institute}
              </span>
            )}
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-extrabold text-gray-900">₹{note.price}</span>
              {note.originalPrice && (
                <span className="text-xs text-gray-400 line-through">₹{note.originalPrice}</span>
              )}
              {discount && (
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                  {discount}% OFF
                </span>
              )}
            </div>
            <p className="text-[10px] text-gray-400 font-medium">{note.salesCount}+ students enrolled</p>
          </div>

          {isPurchased ? (
            <Link
              href={`/my-notes/${note.id}/read`}
              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-colors shadow-xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Read PDF</span>
            </Link>
          ) : (
            <Link
              href={`/notes/${note.id}`}
              className="inline-flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-colors shadow-xs group-hover:translate-x-0.5"
            >
              <span>View Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
