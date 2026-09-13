'use client';

import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useData } from '@/context/DataContext';
import { ShoppingCart, Search, CheckCircle2, IndianRupee, CreditCard, Calendar } from 'lucide-react';

export default function AdminPurchasesPage() {
  const { purchases } = useData();
  const [search, setSearch] = useState('');

  const filteredPurchases = purchases.filter(p =>
    p.transactionId.toLowerCase().includes(search.toLowerCase()) ||
    p.studentName.toLowerCase().includes(search.toLowerCase()) ||
    p.studentEmail.toLowerCase().includes(search.toLowerCase()) ||
    p.noteTitle.toLowerCase().includes(search.toLowerCase())
  );

  const totalEarnings = purchases.reduce((acc, curr) => acc + (curr.amount || 0), 0);

  return (
    <AdminLayout
      title="Orders & Purchase Records"
      subtitle="Complete ledger of digital note purchases, transaction IDs, payment methods, and revenue."
    >
      <div className="space-y-6">
        
        {/* Top Summary Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
            <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Gross Sales</span>
            <p className="text-2xl font-extrabold text-emerald-400 mt-1">₹{totalEarnings.toLocaleString()}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
            <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Total Completed Orders</span>
            <p className="text-2xl font-extrabold text-white mt-1">{purchases.length}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
            <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Average Order Value</span>
            <p className="text-2xl font-extrabold text-indigo-400 mt-1">
              ₹{purchases.length ? Math.round(totalEarnings / purchases.length) : 0}
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search transaction ID, student, note title..."
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
          <span className="text-xs text-slate-400 font-mono">Total {purchases.length} transactions</span>
        </div>

        {/* Orders Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-4">Transaction ID</th>
                  <th className="p-4">Student Info</th>
                  <th className="p-4">Note Unlocked</th>
                  <th className="p-4">Amount Paid</th>
                  <th className="p-4">Method</th>
                  <th className="p-4">Date & Time</th>
                  <th className="p-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredPurchases.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-mono text-amber-400 font-bold text-[11px]">{p.transactionId}</td>
                    <td className="p-4">
                      <div className="font-bold text-white">{p.studentName}</div>
                      <div className="text-[10px] text-slate-500">{p.studentEmail}</div>
                    </td>
                    <td className="p-4 max-w-xs">
                      <div className="font-semibold text-slate-200 truncate">{p.noteTitle}</div>
                      <div className="text-[10px] text-indigo-400 font-medium">{p.categoryName}</div>
                    </td>
                    <td className="p-4 font-extrabold text-emerald-400 text-sm">₹{p.amount}</td>
                    <td className="p-4 text-slate-400 text-[11px]">
                      <div className="flex items-center gap-1">
                        <CreditCard className="w-3 h-3 text-slate-500" />
                        <span>{p.paymentMethod}</span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-400 text-[11px] font-mono">{p.purchaseDate}</td>
                    <td className="p-4 text-right">
                      <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" /> Completed
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}
