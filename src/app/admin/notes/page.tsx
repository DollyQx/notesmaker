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
  Star,
  CheckCircle2,
  Tag,
  ShieldCheck,
  Eye
} from 'lucide-react';
import Link from 'next/link';

export default function AdminNotesPage() {
  const { notes, categories, subcategories, addNote, updateNote, deleteNote } = useData();

  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  // Form states
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
  const [sampleText, setSampleText] = useState('');
  const [featured, setFeatured] = useState(false);
  const [isBestseller, setIsBestseller] = useState(false);
  const [pdfFileName, setPdfFileName] = useState('note_document_v1.pdf');

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
    setSampleText('');
    setFeatured(false);
    setIsBestseller(false);
    setPdfFileName('handwritten_notes_final.pdf');
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
    setSampleText(note.sampleText || '');
    setFeatured(!!note.featured);
    setIsBestseller(!!note.isBestseller);
    setPdfFileName(`notes_${note.id}.pdf`);
    setIsModalOpen(true);
  };

  const handleCategorySelectChange = (newCatId: string) => {
    setCategoryId(newCatId);
    const matchingSub = subcategories.find(s => s.categoryId === newCatId);
    setSubCategoryId(matchingSub?.id || '');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !categoryId) return;

    const cat = categories.find(c => c.id === categoryId);
    const sub = subcategories.find(s => s.id === subCategoryId);
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const parsedPrice = parseFloat(price) || 99;
    const parsedOrigPrice = parseFloat(originalPrice) || undefined;
    const parsedPages = parseInt(pages) || 50;

    if (editingNote) {
      updateNote(editingNote.id, {
        title: title.trim(),
        slug,
        description: description.trim(),
        categoryId,
        categoryName: cat?.name || 'General',
        subCategoryId,
        subCategoryName: sub?.name || 'General',
        price: parsedPrice,
        originalPrice: parsedOrigPrice,
        author: author.trim() || 'Topper Contributor',
        institute: institute.trim() || undefined,
        pages: parsedPages,
        fileSize,
        sampleText: sampleText.trim() || undefined,
        featured,
        isBestseller
      });
    } else {
      addNote({
        title: title.trim(),
        slug,
        description: description.trim(),
        categoryId,
        categoryName: cat?.name || 'General',
        subCategoryId,
        subCategoryName: sub?.name || 'General',
        price: parsedPrice,
        originalPrice: parsedOrigPrice,
        author: author.trim() || 'Topper Contributor',
        institute: institute.trim() || undefined,
        pages: parsedPages,
        fileSize,
        sampleText: sampleText.trim() || undefined,
        featured,
        isBestseller,
        pdfUrl: `/api/notes/note-demo/pdf`,
        tags: [cat?.name || 'General', 'NotesMaker']
      });
    }

    setIsModalOpen(false);
  };

  const filteredNotes = notes.filter(n =>
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.categoryName.toLowerCase().includes(search.toLowerCase()) ||
    n.author.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout
      title="Notes Library & PDF Uploads"
      subtitle="Publish, edit prices, upload PDF documents, and manage store inventory."
      actionButton={{
        label: 'Upload New PDF Note',
        onClick: handleOpenAddModal,
        icon: <Plus className="w-4 h-4" />
      }}
    >
      <div className="space-y-6">
        
        {/* Search Bar */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, author, category..."
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
          <span className="text-xs text-slate-400 font-mono">Total {notes.length} published notes</span>
        </div>

        {/* Notes Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-4">Note Document Title</th>
                  <th className="p-4">Category & Sub-Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Author / College</th>
                  <th className="p-4">Pages & Size</th>
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
                    <td className="p-4 text-slate-400 text-[11px]">
                      <div>{note.pages} Pages</div>
                      <div className="text-[10px] text-slate-500">{note.fileSize}</div>
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
                          onClick={() => {
                            if (confirm(`Delete note "${note.title}"?`)) {
                              deleteNote(note.id);
                            }
                          }}
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

      </div>

      {/* Note Upload / Edit Modal */}
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
                    min={1}
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
                    PDF File Upload Simulation
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          setPdfFileName(e.target.files[0].name);
                          setFileSize(`${(e.target.files[0].size / (1024 * 1024)).toFixed(1)} MB`);
                        }
                      }}
                      className="hidden"
                      id="pdf-file-input"
                    />
                    <label
                      htmlFor="pdf-file-input"
                      className="flex-1 bg-slate-950 border border-slate-800 hover:bg-slate-800 px-3.5 py-2.5 rounded-xl text-xs text-indigo-400 cursor-pointer flex items-center justify-between truncate"
                    >
                      <span className="truncate">{pdfFileName}</span>
                      <Upload className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    </label>
                  </div>
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
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-3 rounded-xl transition-colors shadow-lg"
                >
                  {editingNote ? 'Save Changes' : 'Publish Note Document'}
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
