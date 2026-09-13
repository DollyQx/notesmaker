'use client';

import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useData } from '@/context/DataContext';
import { Note } from '@/types';
import {
  FileText,
  Plus,
  Edit,
  Trash2,
  X,
  Search,
  Upload,
  Eye,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Globe,
  EyeOff
} from 'lucide-react';
import Link from 'next/link';

export default function AdminNotesPage() {
  const { notes, categories, subcategories, addNote, updateNote, deleteNote, isLoading } = useData();

  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  // Form & Feedback states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [subCategoryId, setSubCategoryId] = useState('');
  const [price, setPrice] = useState('149');
  const [originalPrice, setOriginalPrice] = useState('399');
  const [author, setAuthor] = useState('');
  const [institute, setInstitute] = useState('');
  const [pages, setPages] = useState('95');
  const [fileSize, setFileSize] = useState('12.4 MB');
  const [status, setStatus] = useState<'ACTIVE' | 'DRAFT' | 'ARCHIVED'>('ACTIVE');
  const [featured, setFeatured] = useState(false);
  const [isBestseller, setIsBestseller] = useState(false);
  const [pdfFileName, setPdfFileName] = useState('note_document_v1.pdf');
  
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredSubCategories = subcategories.filter(s => s.categoryId === categoryId);

  const handleOpenAddModal = () => {
    setEditingNote(null);
    setTitle('');
    setDescription('');
    const defaultCat = categories[0]?.id || '';
    setCategoryId(defaultCat);
    const defaultSub = subcategories.find(s => s.categoryId === defaultCat)?.id || '';
    setSubCategoryId(defaultSub);
    setPrice('149');
    setOriginalPrice('399');
    setAuthor('Topper Contributor');
    setInstitute('IIT Delhi');
    setPages('95');
    setFileSize('12.4 MB');
    setStatus('ACTIVE');
    setFeatured(false);
    setIsBestseller(false);
    setPdfFileName('handwritten_notes_final.pdf');
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (note: Note) => {
    setEditingNote(note);
    setTitle(note.title);
    setDescription(note.description);
    setCategoryId(note.categoryId);
    setSubCategoryId(note.subCategoryId);
    setPrice(note.price.toString());
    setOriginalPrice(note.originalPrice ? note.originalPrice.toString() : '');
    setAuthor(note.author);
    setInstitute(note.institute || '');
    setPages(note.pages.toString());
    setFileSize(note.fileSize);
    setStatus(note.status as any || 'ACTIVE');
    setFeatured(!!note.featured);
    setIsBestseller(!!note.isBestseller);
    setPdfFileName(`notes_${note.id}.pdf`);
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleCategorySelectChange = (newCatId: string) => {
    setCategoryId(newCatId);
    const matchingSub = subcategories.find(s => s.categoryId === newCatId);
    setSubCategoryId(matchingSub?.id || '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !categoryId || !subCategoryId) return;

    setIsSubmitting(true);
    setErrorMsg('');

    const parsedPrice = parseFloat(price) || 99;
    const parsedOrigPrice = parseFloat(originalPrice) || undefined;
    const parsedPages = parseInt(pages) || 50;

    let res;
    if (editingNote) {
      res = await updateNote(editingNote.id, {
        title: title.trim(),
        description: description.trim(),
        categoryId,
        subCategoryId,
        price: parsedPrice,
        originalPrice: parsedOrigPrice,
        author: author.trim(),
        institute: institute.trim() || undefined,
        pages: parsedPages,
        fileSize,
        status,
        featured,
        isBestseller
      });
    } else {
      res = await addNote({
        title: title.trim(),
        description: description.trim(),
        categoryId,
        subCategoryId,
        price: parsedPrice,
        originalPrice: parsedOrigPrice,
        author: author.trim(),
        institute: institute.trim() || undefined,
        pages: parsedPages,
        fileSize,
        status,
        featured,
        isBestseller,
        pdfUrl: `/api/notes/note-demo/pdf`
      });
    }

    setIsSubmitting(false);

    if (res.success) {
      setSuccessMsg(editingNote ? 'Note updated successfully!' : 'Note published to marketplace!');
      setTimeout(() => setSuccessMsg(''), 4000);
      setIsModalOpen(false);
    } else {
      setErrorMsg(res.error || 'Failed to save note');
    }
  };

  const handleDelete = async (note: Note) => {
    if (confirm(`Delete note "${note.title}"?`)) {
      const res = await deleteNote(note.id);
      if (res.success) {
        setSuccessMsg(`Note "${note.title}" deleted.`);
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        alert(res.error || 'Failed to delete note');
      }
    }
  };

  const toggleStatus = async (note: Note) => {
    const newStatus = note.status === 'ACTIVE' ? 'DRAFT' : 'ACTIVE';
    const res = await updateNote(note.id, { status: newStatus as any });
    if (res.success) {
      setSuccessMsg(`Note status updated to ${newStatus}`);
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  const filteredNotes = notes.filter(n =>
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.categoryName?.toLowerCase().includes(search.toLowerCase()) ||
    n.author.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout
      title="Notes Library & Document Uploads"
      subtitle="Publish new PDF note packages, edit pricing, manage publication status, and view library inventory."
      actionButton={{
        label: 'Upload New PDF Note',
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
              placeholder="Search by title, author, category..."
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
          <span className="text-xs text-slate-400 font-mono self-end sm:self-auto">
            {notes.length} published notes
          </span>
        </div>

        {/* Notes Table */}
        {isLoading ? (
          <div className="py-16 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-amber-500 animate-spin mx-auto" />
            <p className="text-xs font-mono text-slate-400">Loading digital notes from database...</p>
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
            <FileText className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-sm font-bold text-white">No Notes Found</h3>
            <p className="text-xs text-slate-400">Upload your first digital note document package.</p>
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-4">Note Document Title</th>
                    <th className="p-4">Category / Branch</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Author / College</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Sales</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredNotes.map((note) => (
                    <tr key={note.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 font-bold text-white max-w-xs">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex-shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="line-clamp-1">{note.title}</p>
                            <div className="flex items-center gap-1 mt-0.5">
                              {note.isBestseller && (
                                <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-bold uppercase">
                                  Bestseller
                                </span>
                              )}
                              {note.featured && (
                                <span className="text-[9px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.2 rounded font-bold uppercase">
                                  Featured
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-slate-200">{note.categoryName}</div>
                        <div className="text-[10px] text-slate-500">{note.subCategoryName}</div>
                      </td>
                      <td className="p-4 font-extrabold text-emerald-400 text-sm">
                        ₹{note.price}
                        {note.originalPrice && (
                          <span className="text-[10px] text-slate-500 line-through ml-1 font-normal">
                            ₹{note.originalPrice}
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-slate-300">
                        <div>{note.author}</div>
                        <div className="text-[10px] text-slate-500">{note.institute || 'General'}</div>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => toggleStatus(note)}
                          className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border transition-colors ${
                            note.status === 'ACTIVE'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}
                          title="Click to toggle publish status"
                        >
                          {note.status === 'ACTIVE' ? <Globe className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          <span>{note.status || 'ACTIVE'}</span>
                        </button>
                      </td>
                      <td className="p-4 font-mono text-indigo-400 font-bold">{note.salesCount}</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/my-notes/${note.id}/read`}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-400 transition-colors"
                            title="Preview Online PDF Reader"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => handleOpenEditModal(note)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-400 transition-colors"
                            title="Edit Note Details"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(note)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-600 hover:text-white text-slate-400 transition-colors"
                            title="Delete Note"
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

      {/* Note Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl my-8">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                {editingNote ? 'Edit Note Publication' : 'Upload & Publish New PDF Note'}
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
                  Note Document Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Complete System Design & Microservices Notes"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => handleCategorySelectChange(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Sub-Category
                  </label>
                  <select
                    value={subCategoryId}
                    onChange={(e) => setSubCategoryId(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {filteredSubCategories.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Selling Price (₹)
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="149"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Original Price (Strikethrough ₹)
                  </label>
                  <input
                    type="number"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    placeholder="399"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Author / Topper Ranker Name
                  </label>
                  <input
                    type="text"
                    required
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Aman Sharma (AIR 12)"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    College / Institute
                  </label>
                  <input
                    type="text"
                    value={institute}
                    onChange={(e) => setInstitute(e.target.value)}
                    placeholder="IIT Delhi"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Page Count
                  </label>
                  <input
                    type="number"
                    required
                    value={pages}
                    onChange={(e) => setPages(e.target.value)}
                    placeholder="95"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Publication Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="ACTIVE">ACTIVE (Published in Store)</option>
                    <option value="DRAFT">DRAFT (Hidden from Students)</option>
                    <option value="ARCHIVED">ARCHIVED</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Full Description & Syllabus
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed breakdown of topics, mind maps, formula sheets..."
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 font-medium">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500 bg-slate-950 border-slate-800"
                  />
                  <span>Mark as Featured</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 font-medium">
                  <input
                    type="checkbox"
                    checked={isBestseller}
                    onChange={(e) => setIsBestseller(e.target.checked)}
                    className="rounded text-amber-500 focus:ring-amber-500 bg-slate-950 border-slate-800"
                  />
                  <span>Mark as Bestseller</span>
                </label>
              </div>

              <div className="pt-4 flex gap-2 border-t border-slate-800">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-3 rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{editingNote ? 'Save Changes' : 'Publish Note Document'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs px-5 py-3 rounded-xl"
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
