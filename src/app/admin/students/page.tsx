'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Users, Search, GraduationCap, Mail, CheckCircle2, Loader2 } from 'lucide-react';

interface StudentRecord {
  id: string;
  name: string;
  email: string;
  college: string;
  joinedDate: string;
  purchasesCount: number;
  totalSpent: number;
}

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/students?search=${encodeURIComponent(search)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) setStudents(data.students);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [search]);

  return (
    <AdminLayout
      title="Registered Students"
      subtitle="View student user accounts, college affiliation, total purchased notes count, and expenditure."
    >
      <div className="space-y-6">
        
        {/* Search Bar */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="relative w-full sm:max-w-md">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search student name, email, college..."
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
          <span className="text-xs text-slate-400 font-mono self-end sm:self-auto">
            {students.length} students found
          </span>
        </div>

        {/* Students Table */}
        {loading ? (
          <div className="py-16 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-amber-500 animate-spin mx-auto" />
            <p className="text-xs font-mono text-slate-400">Loading student accounts from database...</p>
          </div>
        ) : students.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
            <Users className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-sm font-bold text-white">No Students Registered</h3>
            <p className="text-xs text-slate-400">Student accounts will appear here when they create accounts.</p>
          </div>
        ) : (
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
                  {students.map((stud) => (
                    <tr key={stud.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 font-bold text-white flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-purple-500/20 text-purple-300 font-bold flex items-center justify-center text-xs border border-purple-500/30">
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
                          <CheckCircle2 className="w-3 h-3" /> Verified Student
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}
