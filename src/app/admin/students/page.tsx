'use client';

import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useData } from '@/context/DataContext';
import { Users, Search, GraduationCap, Mail, Phone, ShieldCheck, CheckCircle2, Ban } from 'lucide-react';

export default function AdminStudentsPage() {
  const { students } = useData();
  const [search, setSearch] = useState('');

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase()) ||
    s.college?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout
      title="Registered Students"
      subtitle="View student accounts, college affiliation, total purchased notes, and spending."
    >
      <div className="space-y-6">
        
        {/* Search Bar */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search student name, email, college..."
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
          <span className="text-xs text-slate-400 font-mono">Total {students.length} students</span>
        </div>

        {/* Students Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-4">Student Name</th>
                  <th className="p-4">Contact & College</th>
                  <th className="p-4">Joined Date</th>
                  <th className="p-4">Purchased Notes</th>
                  <th className="p-4">Total Spent</th>
                  <th className="p-4 text-right">Account Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredStudents.map((stud) => (
                  <tr key={stud.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-bold text-white flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-purple-500/20 text-purple-300 font-bold flex items-center justify-center text-xs">
                        {stud.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-white font-bold">{stud.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{stud.id}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-slate-200">
                        <Mail className="w-3 h-3 text-slate-400" />
                        <span>{stud.email}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1">
                        <GraduationCap className="w-3 h-3 text-indigo-400" />
                        <span>{stud.college || 'General Aspirant'}</span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-400 text-[11px] font-mono">{stud.joinedDate}</td>
                    <td className="p-4 font-bold text-indigo-400 text-sm">{stud.purchasesCount} Notes</td>
                    <td className="p-4 font-bold text-emerald-400 text-sm">₹{stud.totalSpent}</td>
                    <td className="p-4 text-right">
                      <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" /> Active Student
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
