'use client';

import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useData } from '@/context/DataContext';
import { SubCategory } from '@/types';
import { Tags, Plus, Edit, Trash2, X, Search, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function AdminSubCategoriesPage() {
  const { categories, subcategories, addSubCategory, updateSubCategory, deleteSubCategory, isLoading } = useData();

  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubCategory, setEditingSubCategory] = useState<SubCategory | null>(null);

  // Form & Feedback states
  const [categoryId, setCategoryId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenAddModal = () => {
    setEditingSubCategory(null);
    setCategoryId(categories[0]?.id || '');
    setName('');
    setDescription('');
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (sub: SubCategory) => {
    setEditingSubCategory(sub);
    setCategoryId(sub.categoryId);
    setName(sub.name);
    setDescription(sub.description || '');
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !categoryId) return;

    setIsSubmitting(true);
    setErrorMsg('');

    let res;
    if (editingSubCategory) {
      res = await updateSubCategory(editingSubCategory.id, {
        name: name.trim(),
        categoryId,
        description: description.trim()
      });
    } else {
      res = await addSubCategory({
        name: name.trim(),
        categoryId,
        description: description.trim()
      });
    }

    setIsSubmitting(false);

    if (res.success) {
      setSuccessMsg(editingSubCategory ? 'Sub-category updated!' : 'New sub-category created!');
      setTimeout(() => setSuccessMsg(''), 4000);
      setIsModalOpen(false);
    } else {
      setErrorMsg(res.error || 'Failed to save sub-category');
    }
  };

  const handleDelete = async (sub: SubCategory) => {
    if (confirm(`Delete sub-category "${sub.name}"?`)) {
      const res = await deleteSubCategory(sub.id);
      if (res.success) {
        setSuccessMsg(`Sub-category "${sub.name}" deleted.`);
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        alert(res.error || 'Failed to delete sub-category');
      }
    }
  };

  const filteredSubCategories = subcategories.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.categoryName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout
      title="Manage Sub-Categories"
      subtitle="Define specialized subject branches and exam topics within categories."
      actionButton={{
        label: 'Add Sub-Category',
        onClick: handleOpenAddModal,
        icon: <Plus className="w-4 h-4" />
      }}
    >
      <div className="space-y-6">
        
        {/* Toast Alert Banner */}
        {successMsg && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Search Bar */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="relative w-full sm:max-w-md">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search sub-category or parent stream..."
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
          <span className="text-xs text-slate-400 font-mono self-end sm:self-auto">
            {subcategories.length} total sub-categories
          </span>
        </div>

        {/* SubCategories Table */}
        {isLoading ? (
          <div className="py-16 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-amber-500 animate-spin mx-auto" />
            <p className="text-xs font-mono text-slate-400">Loading sub-categories from database...</p>
          </div>
        ) : filteredSubCategories.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
            <Tags className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-sm font-bold text-white">No Sub-Categories Found</h3>
            <p className="text-xs text-slate-400">Add sub-categories under your parent categories.</p>
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-4">Sub-Category Name</th>
                    <th className="p-4">Parent Category</th>
                    <th className="p-4">Slug</th>
                    <th className="p-4">Description</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredSubCategories.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 font-bold text-white flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          <Tags className="w-4 h-4" />
                        </div>
                        <span>{sub.name}</span>
                      </td>
                      <td className="p-4">
                        <span className="bg-slate-950 text-indigo-400 font-bold px-2.5 py-1 rounded-md border border-slate-800 text-[11px]">
                          {sub.categoryName}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-slate-400 text-[11px]">{sub.slug}</td>
                      <td className="p-4 text-slate-400 max-w-xs truncate">{sub.description || '—'}</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditModal(sub)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-400 transition-colors"
                            title="Edit Sub-Category"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(sub)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-600 hover:text-white text-slate-400 transition-colors"
                            title="Delete Sub-Category"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* Sub-Category Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">
                {editingSubCategory ? 'Edit Sub-Category' : 'Add New Sub-Category'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Parent Category
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Sub-Category Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dynamic Programming Patterns"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Summary of topics covered..."
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{editingSubCategory ? 'Save Sub-Category' : 'Create Sub-Category'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs px-4 py-3 rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
