'use client';

import React from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import { useData } from '@/context/DataContext';
import {
  FileText,
  Users,
  ShoppingCart,
  IndianRupee,
  FolderTree,
  Tags,
  TrendingUp,
  Plus,
  ArrowUpRight,
  ShieldCheck,
  Star
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { notes, categories, subcategories, students, purchases } = useData();

  const totalRevenue = purchases.reduce((acc, curr) => acc + (curr.amount || 0), 0);

  return (
    <AdminLayout
      title="Store Performance Dashboard"
      subtitle="Overview of published notes, categories, student registrations, and earnings."
    >
      <div className="space-y-8">
        
        {/* KPI Stats Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-emerald-400">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Revenue</span>
              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <IndianRupee className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-white">₹{totalRevenue.toLocaleString()}</p>
            <p className="text-[10px] text-slate-400 font-mono">From {purchases.length} total orders</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-indigo-400">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Notes Published</span>
              <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-white">{notes.length}</p>
            <p className="text-[10px] text-slate-400 font-mono">{categories.length} main categories</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-purple-400">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Students</span>
              <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-white">{students.length}</p>
            <p className="text-[10px] text-slate-400 font-mono">Registered student accounts</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-amber-400">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Orders</span>
              <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <ShoppingCart className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-white">{purchases.length}</p>
            <p className="text-[10px] text-slate-400 font-mono">Successful purchases</p>
          </div>
        </div>

        {/* Quick Management Shortcuts */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Quick Management Shortcuts</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/admin/notes"
              className="p-4 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 transition-colors flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-600/20 text-indigo-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-indigo-400 transition-colors">
                    Upload / Manage Notes
                  </h4>
                  <p className="text-[10px] text-slate-400">Add title, price, & upload PDF</p>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
            </Link>

            <Link
              href="/admin/categories"
              className="p-4 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 transition-colors flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-600/20 text-purple-400">
                  <FolderTree className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-purple-400 transition-colors">
                    Manage Categories
                  </h4>
                  <p className="text-[10px] text-slate-400">{categories.length} categories active</p>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
            </Link>

            <Link
              href="/admin/subcategories"
              className="p-4 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 transition-colors flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-600/20 text-amber-400">
                  <Tags className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
                    Manage Sub-Categories
                  </h4>
                  <p className="text-[10px] text-slate-400">{subcategories.length} sub-categories active</p>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
            </Link>
          </div>
        </div>

        {/* Recent Purchases & Bestsellers Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Recent Orders Table (2 Cols) */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-amber-400" />
                Recent Student Transactions
              </h3>
              <Link href="/admin/purchases" className="text-xs font-bold text-indigo-400 hover:text-indigo-300">
                View All Orders →
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3 rounded-l-lg">Txn ID</th>
                    <th className="p-3">Student</th>
                    <th className="p-3">Note Title</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3 rounded-r-lg">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {purchases.slice(0, 5).map((p) => (
                    <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3 font-mono text-indigo-400 text-[11px] font-bold">{p.transactionId}</td>
                      <td className="p-3">
                        <div className="font-semibold text-white">{p.studentName}</div>
                        <div className="text-[10px] text-slate-500">{p.studentEmail}</div>
                      </td>
                      <td className="p-3 max-w-xs truncate font-medium text-slate-200">{p.noteTitle}</td>
                      <td className="p-3 font-bold text-emerald-400">₹{p.amount}</td>
                      <td className="p-3 text-[11px] text-slate-400">{p.purchaseDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Selling Notes Sidebar (1 Col) */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                Top Performing Notes
              </h3>
            </div>

            <div className="space-y-3">
              {notes.slice(0, 4).map((n) => (
                <div key={n.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
                  <h4 className="text-xs font-bold text-white line-clamp-1">{n.title}</h4>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>{n.salesCount} sales</span>
                    <span className="font-bold text-indigo-400">₹{n.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </AdminLayout>
  );
}
