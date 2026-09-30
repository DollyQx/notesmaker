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
  EyeOff,
  FileCheck,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import EducationalTextEditor from '@/components/admin/EducationalTextEditor';
import TextNoteReader from '@/components/TextNoteReader';

export default function AdminNotesPage() {
  const { notes, categories, subcategories, addNote, updateNote, deleteNote, isLoading } = useData();

  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  // Form & Feedback states
  const [contentType, setContentType] = useState<'PDF' | 'TEXT'>('PDF');
  const [textContent, setTextContent] = useState('');
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

  // Demo / Preview states
  const [demoEnabled, setDemoEnabled] = useState<boolean>(false);
  const [demoContent, setDemoContent] = useState<string>('');
  const [demoPdfFileRef, setDemoPdfFileRef] = useState<string>('');
  const [demoPdfFileName, setDemoPdfFileName] = useState<string>('');
  const [isUploadingDemoPdf, setIsUploadingDemoPdf] = useState<boolean>(false);
  const [demoPdfUploadMsg, setDemoPdfUploadMsg] = useState<string>('');
  const [isDemoPreviewModalOpen, setIsDemoPreviewModalOpen] = useState<boolean>(false);
  
  // PDF File Upload states
  const [pdfFileRef, setPdfFileRef] = useState<string>('');
  const [pdfFileName, setPdfFileName] = useState<string>('');
  const [isUploadingPdf, setIsUploadingPdf] = useState<boolean>(false);
  const [uploadStatusMsg, setUploadStatusMsg] = useState<string>('');
  
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredSubCategories = subcategories.filter(s => s.categoryId === categoryId);

  const handleOpenAddModal = () => {
    setEditingNote(null);
    setContentType('PDF');
    setTextContent('');
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
    setDemoEnabled(false);
    setDemoContent('');
    setDemoPdfFileRef('');
    setDemoPdfFileName('');
    setDemoPdfUploadMsg('');
    setPdfFileRef('');
    setPdfFileName('');
    setUploadStatusMsg('');
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (note: Note) => {
    setEditingNote(note);
    setContentType((note.contentType as 'PDF' | 'TEXT') || 'PDF');
    setTextContent(note.textContent || '');
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
    setDemoEnabled(!!note.demoEnabled);
    setDemoContent(note.demoContent || '');
    setDemoPdfFileRef(note.demoPdfUrl || '');
    setDemoPdfFileName(note.demoPdfUrl ? note.demoPdfUrl.split('/').pop() || 'sample.pdf' : '');
    setDemoPdfUploadMsg('');
    setPdfFileRef(note.pdfUrl || '');
    setPdfFileName(note.pdfUrl ? note.pdfUrl.split('/').pop() || 'document.pdf' : '');
    setUploadStatusMsg('');
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleCategorySelectChange = (newCatId: string) => {
    setCategoryId(newCatId);
    const matchingSub = subcategories.find(s => s.categoryId === newCatId);
    setSubCategoryId(matchingSub?.id || '');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      setErrorMsg('Only PDF documents (.pdf) are allowed.');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setErrorMsg('File size exceeds 50 MB limit.');
      return;
    }

    setIsUploadingPdf(true);
    setUploadStatusMsg('Encrypting and saving PDF file to server storage...');
    setErrorMsg('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      setIsUploadingPdf(false);

      if (data.success) {
        setPdfFileRef(data.fileRef);
        setPdfFileName(data.originalName);
        setFileSize(data.fileSize);
        setUploadStatusMsg(`Uploaded ${data.originalName} (${data.fileSize})`);
      } else {
        setErrorMsg(data.error || 'Failed to upload PDF');
        setUploadStatusMsg('');
      }
    } catch (err) {
      setIsUploadingPdf(false);
      setErrorMsg('Network error while uploading PDF');
      setUploadStatusMsg('');
    }
  };

  const handleDemoPdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      setErrorMsg('Only PDF documents (.pdf) are allowed for demo preview.');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setErrorMsg('Demo PDF file size exceeds 20 MB limit.');
      return;
    }

    setIsUploadingDemoPdf(true);
    setDemoPdfUploadMsg('Uploading safe sample/demo PDF...');
    setErrorMsg('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      setIsUploadingDemoPdf(false);

      if (data.success) {
        setDemoPdfFileRef(data.fileRef);
        setDemoPdfFileName(data.originalName);
        setDemoPdfUploadMsg(`Uploaded sample ${data.originalName} (${data.fileSize})`);
      } else {
        setErrorMsg(data.error || 'Failed to upload demo PDF');
        setDemoPdfUploadMsg('');
      }
    } catch (err) {
      setIsUploadingDemoPdf(false);
      setErrorMsg('Network error while uploading demo PDF');
      setDemoPdfUploadMsg('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !categoryId || !subCategoryId) return;

    if (contentType === 'PDF') {
      const hasPdf = pdfFileRef || (editingNote && editingNote.pdfUrl);
      if (!hasPdf) {
        setErrorMsg('Please upload a PDF document before saving.');
        return;
      }
    }

    if (contentType === 'TEXT') {
      const cleanText = textContent.replace(/<[^>]*>/g, '').trim();
      if (!cleanText && !textContent.trim()) {
        setErrorMsg('Please enter formatted educational text content before saving.');
        return;
      }
    }

    setIsSubmitting(true);
    setErrorMsg('');

    const parsedPrice = parseFloat(price) || 99;
    const parsedOrigPrice = parseFloat(originalPrice) || undefined;
    const wordCount = textContent.replace(/<[^>]*>/g, '').trim().split(/\s+/).filter(Boolean).length;
    const parsedPages = parseInt(pages) || (contentType === 'TEXT' ? Math.max(1, Math.ceil(wordCount / 250)) : 50);
    const calculatedFileSize = contentType === 'TEXT' ? `${Math.max(1, Math.round(wordCount * 0.005))} KB Text Document` : fileSize;

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
        fileSize: calculatedFileSize,
        status,
        featured,
        isBestseller,
        contentType,
        textContent: contentType === 'TEXT' ? textContent : editingNote.textContent,
        pdfUrl: contentType === 'PDF' ? (pdfFileRef || editingNote.pdfUrl) : editingNote.pdfUrl,
        demoEnabled,
        demoContent: demoEnabled ? (demoContent ? demoContent.trim() : '') : '',
        demoPdfUrl: (contentType === 'PDF' && demoEnabled) ? (demoPdfFileRef || editingNote.demoPdfUrl || '') : ''
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
        fileSize: calculatedFileSize,
        status,
        featured,
        isBestseller,
        contentType,
        textContent: contentType === 'TEXT' ? textContent : undefined,
        pdfUrl: contentType === 'PDF' ? (pdfFileRef || '') : undefined,
        demoEnabled,
        demoContent: demoEnabled ? (demoContent ? demoContent.trim() : undefined) : undefined,
        demoPdfUrl: (contentType === 'PDF' && demoEnabled) ? (demoPdfFileRef || undefined) : undefined
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
      subtitle="Publish new PDF note packages, upload private PDF files, edit pricing, and manage publication status."
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
                              <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                                note.contentType === 'TEXT'
                                  ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                                  : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                              }`}>
                                {note.contentType || 'PDF'}
                              </span>
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

      {/* Note Form Modal - Responsive Mobile First */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/75 backdrop-blur-xs overflow-y-auto overscroll-contain">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl max-w-4xl w-full min-w-0 p-3.5 sm:p-6 md:p-8 space-y-4 sm:space-y-6 shadow-2xl my-auto sm:my-8 max-h-[96vh] overflow-y-auto overflow-x-hidden">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3 gap-2">
              <h3 className="font-bold text-white text-sm sm:text-base flex items-center gap-2 truncate">
                <FileText className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                <span className="truncate">{editingNote ? 'Edit Note Publication' : 'Create & Publish New Note'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl hover:bg-slate-800 transition-colors flex-shrink-0"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span className="break-words">{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Content Type Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Note Format / Content Type
                </label>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <button
                    type="button"
                    onClick={() => setContentType('PDF')}
                    className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl border text-xs font-bold transition-all min-h-[44px] ${
                      contentType === 'PDF'
                        ? 'bg-blue-600/20 border-blue-500 text-blue-400 shadow-sm shadow-blue-500/10'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <FileText className="w-4 h-4 flex-shrink-0" />
                    <span>PDF Note</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setContentType('TEXT')}
                    className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl border text-xs font-bold transition-all min-h-[44px] ${
                      contentType === 'TEXT'
                        ? 'bg-orange-500/20 border-orange-500 text-orange-400 shadow-sm shadow-orange-500/10'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <FileCheck className="w-4 h-4 flex-shrink-0" />
                    <span>Text Note</span>
                  </button>
                </div>
              </div>

              {/* PDF File Uploader Box */}
              {contentType === 'PDF' && (
                <div className="bg-slate-950 border border-dashed border-slate-700 rounded-2xl p-4 sm:p-5 text-center space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center mx-auto">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Upload Private Master PDF Document</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Select note PDF file (Max 50MB). Stored securely in protected storage; students must purchase before access.
                    </p>
                  </div>

                  <div className="flex justify-center items-center gap-3">
                    <label className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors shadow-md inline-flex items-center gap-1.5 min-h-[44px]">
                      {isUploadingPdf ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                      <span>{isUploadingPdf ? 'Uploading...' : (pdfFileName ? 'Change PDF File' : 'Choose PDF File')}</span>
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileUpload}
                        disabled={isUploadingPdf}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {uploadStatusMsg && (
                    <div className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 py-1.5 px-3 rounded-lg border border-emerald-500/20 inline-block break-all max-w-full">
                      ✓ {uploadStatusMsg}
                    </div>
                  )}
                  {pdfFileRef && (
                    <div className="text-[10px] text-slate-500 font-mono break-all max-w-md mx-auto">
                      Storage Ref: {pdfFileRef}
                    </div>
                  )}
                </div>
              )}

              {/* Rich Text Editor Box */}
              {contentType === 'TEXT' && (
                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Educational Text Note Content &amp; Formatting
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsPreviewModalOpen(true)}
                      className="text-xs text-[#005CBF] hover:text-blue-400 font-bold flex items-center gap-1 transition-colors self-start sm:self-auto py-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview Student View</span>
                    </button>
                  </div>
                  <EducationalTextEditor
                    value={textContent}
                    onChange={setTextContent}
                    onPreview={() => setIsPreviewModalOpen(true)}
                    placeholder="Enter comprehensive study notes here..."
                  />
                  <p className="text-[11px] text-slate-500 flex items-start gap-1.5 pt-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>Educational Rich Text: Sanitized server-side. Formatted with watermark &amp; copy restrictions for students.</span>
                  </p>
                </div>
              )}

              {/* TASK 3: Note-Level Demo / Preview Setting */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                        Enable Demo / Preview
                      </h4>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Define what students can see before purchasing. Paid files remain 100% protected.
                    </p>
                  </div>

                  {/* Toggle: OFF / ON */}
                  <div className="inline-flex rounded-xl bg-slate-900 border border-slate-800 p-1 self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setDemoEnabled(false)}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all min-h-[36px] ${
                        !demoEnabled
                          ? 'bg-slate-800 text-white shadow-xs'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      OFF
                    </button>
                    <button
                      type="button"
                      onClick={() => setDemoEnabled(true)}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all min-h-[36px] ${
                        demoEnabled
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      ON
                    </button>
                  </div>
                </div>

                {demoEnabled && (
                  <div className="space-y-4 pt-3 border-t border-slate-800/80">
                    {contentType === 'TEXT' ? (
                      /* TEXT NOTE DEMO PREVIEW CONTROLS */
                      <div className="space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                          <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider">
                            Student Demo / Preview Text Content
                          </label>
                          <div className="flex items-center gap-2">
                            {textContent && (
                              <button
                                type="button"
                                onClick={() => {
                                  // Extract first 2 paragraphs or ~25% as starter demo content
                                  const parts = textContent.split(/<\/p>/i);
                                  const previewSample = parts.slice(0, 3).join('</p>') + (parts.length > 3 ? '</p>' : '');
                                  setDemoContent(previewSample || textContent.slice(0, 500));
                                }}
                                className="text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold underline"
                              >
                                Auto-fill from main note
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => setIsDemoPreviewModalOpen(true)}
                              className="text-[11px] text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 py-1"
                            >
                              <Eye className="w-3 h-3" />
                              <span>Preview Demo View</span>
                            </button>
                          </div>
                        </div>

                        <EducationalTextEditor
                          value={demoContent}
                          onChange={setDemoContent}
                          placeholder="Type or paste sample chapter, key formulas, or free preview content for students..."
                          onPreview={() => setIsDemoPreviewModalOpen(true)}
                        />

                        <p className="text-[11px] text-slate-400 flex items-start gap-1.5 pt-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                          <span>
                            Students can view this educational preview without purchasing. Full note remains locked behind checkout.
                          </span>
                        </p>
                      </div>
                    ) : (
                      /* PDF NOTE DEMO PREVIEW CONTROLS */
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider mb-1">
                            Demo / Preview Summary &amp; Highlights (Non-PDF Excerpt)
                          </label>
                          <textarea
                            rows={3}
                            value={demoContent}
                            onChange={(e) => setDemoContent(e.target.value)}
                            placeholder="Enter syllabus topics, chapter 1 key formulas, and high-yield preview highlights for students..."
                            className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 box-border"
                          />
                        </div>

                        {/* Optional dedicated sample PDF */}
                        <div className="bg-slate-900/90 border border-dashed border-slate-700 rounded-xl p-3.5 space-y-2">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                                <FileText className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                                <span>Optional Sample / Demo PDF (Pages 1-3)</span>
                              </h5>
                              <p className="text-[11px] text-slate-400 mt-0.5">
                                Upload a dedicated truncated sample PDF. Paid master PDF is never exposed.
                              </p>
                            </div>
                            <label className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors border border-slate-700 inline-flex items-center gap-1 self-start sm:self-auto min-h-[38px]">
                              {isUploadingDemoPdf ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                              <span>{isUploadingDemoPdf ? 'Uploading...' : (demoPdfFileName ? 'Change Demo PDF' : 'Choose Demo PDF')}</span>
                              <input
                                type="file"
                                accept="application/pdf"
                                onChange={handleDemoPdfUpload}
                                disabled={isUploadingDemoPdf}
                                className="hidden"
                              />
                            </label>
                          </div>
                          {demoPdfUploadMsg && (
                            <p className="text-[11px] text-emerald-400 font-semibold break-all">✓ {demoPdfUploadMsg}</p>
                          )}
                          {demoPdfFileRef && (
                            <p className="text-[10px] text-slate-500 font-mono break-all truncate">
                              Demo PDF Storage Ref: {demoPdfFileRef}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

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
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[42px] box-border"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => handleCategorySelectChange(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[42px] box-border"
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
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[42px] box-border"
                  >
                    {filteredSubCategories.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold min-h-[42px] box-border"
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
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[42px] box-border"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[42px] box-border"
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
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[42px] box-border"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[42px] box-border"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Publication Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[42px] box-border"
                  >
                    <option value="ACTIVE">ACTIVE (Published in Store)</option>
                    <option value="DRAFT">DRAFT (Hidden from Students)</option>
                    <option value="ARCHIVED">ARCHIVED</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Full Description &amp; Syllabus
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed breakdown of topics, mind maps, formula sheets..."
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 box-border"
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 font-medium p-1 select-none">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 bg-slate-950 border-slate-800"
                  />
                  <span>Mark as Featured</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 font-medium p-1 select-none">
                  <input
                    type="checkbox"
                    checked={isBestseller}
                    onChange={(e) => setIsBestseller(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 bg-slate-950 border-slate-800"
                  />
                  <span>Mark as Bestseller</span>
                </label>
              </div>

              {/* Action Buttons Stacking on Mobile */}
              <div className="pt-4 flex flex-col-reverse sm:flex-row gap-2.5 sm:gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs px-5 py-3 rounded-xl transition-colors min-h-[44px] flex items-center justify-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || isUploadingPdf || isUploadingDemoPdf}
                  className="w-full sm:flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-3 px-4 rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 min-h-[44px]"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{editingNote ? 'Save Changes' : 'Publish Note Document'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Student Preview Modal */}
      {isPreviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-xs overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl max-w-5xl w-full min-w-0 p-3 sm:p-6 space-y-3 sm:space-y-4 shadow-2xl my-auto max-h-[96vh] flex flex-col">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3 gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-[#005CBF] flex-shrink-0" />
                <h3 className="font-bold text-white text-xs sm:text-base truncate">
                  Admin Document Preview • {title || 'Untitled Note'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsPreviewModalOpen(false)}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1 transition-colors flex-shrink-0 min-h-[44px]"
              >
                <X className="w-4 h-4" />
                <span>Close</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto rounded-2xl min-w-0 w-full">
              <TextNoteReader
                note={{
                  id: editingNote?.id || 'admin-preview',
                  title: title || 'Educational Note Document',
                  slug: 'preview-slug',
                  description: description || 'Note preview description',
                  price: parseFloat(price) || 0,
                  originalPrice: parseFloat(originalPrice) || 0,
                  pdfUrl: '',
                  thumbnail: '',
                  categoryId: categoryId || 'general',
                  categoryName: categories.find((c) => c.id === categoryId)?.name || 'General',
                  subCategoryId: subCategoryId || 'general',
                  subCategoryName: subcategories.find((s) => s.id === subCategoryId)?.name || 'General',
                  author: author || 'Admin Contributor',
                  institute: institute || 'Institute',
                  pages: parseInt(pages) || 1,
                  fileSize: 'Text Document',
                  status: 'ACTIVE',
                  featured: false,
                  isBestseller: false,
                  salesCount: 0,
                  rating: 5,
                  contentType: 'TEXT',
                  textContent: textContent || '<p>No content entered yet.</p>',
                  createdAt: new Date().toISOString()
                }}
                isPreview={true}
                directContent={textContent || '<p>No content entered yet.</p>'}
              />
            </div>
          </div>
        </div>
      )}

      {/* Admin Demo / Preview Modal */}
      {isDemoPreviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-xs overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl max-w-4xl w-full min-w-0 p-3 sm:p-6 space-y-3 sm:space-y-4 shadow-2xl my-auto max-h-[96vh] flex flex-col">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3 gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 flex-shrink-0" />
                <h3 className="font-bold text-white text-xs sm:text-base truncate">
                  Student Demo View • {title || 'Untitled Note'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsDemoPreviewModalOpen(false)}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1 transition-colors flex-shrink-0 min-h-[44px]"
              >
                <X className="w-4 h-4" />
                <span>Close</span>
              </button>
            </div>

            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-300 text-xs flex items-center gap-2">
              <Sparkles className="w-4 h-4 flex-shrink-0" />
              <span>Preview Mode: This is exactly what prospective students see before purchasing this note.</span>
            </div>

            <div className="flex-1 overflow-y-auto rounded-2xl min-w-0 w-full">
              <TextNoteReader
                note={{
                  id: editingNote?.id || 'demo-preview',
                  title: title || 'Educational Note Document',
                  slug: 'demo-slug',
                  description: description || 'Demo preview',
                  price: parseFloat(price) || 0,
                  originalPrice: parseFloat(originalPrice) || 0,
                  pdfUrl: '',
                  thumbnail: '',
                  categoryId: categoryId || 'general',
                  categoryName: categories.find((c) => c.id === categoryId)?.name || 'General',
                  subCategoryId: subCategoryId || 'general',
                  subCategoryName: subcategories.find((s) => s.id === subCategoryId)?.name || 'General',
                  author: author || 'Contributor',
                  institute: institute || 'Institute',
                  pages: parseInt(pages) || 1,
                  fileSize: 'Demo Excerpt',
                  status: 'ACTIVE',
                  featured: false,
                  isBestseller: false,
                  salesCount: 0,
                  rating: 5,
                  contentType: 'TEXT',
                  textContent: demoContent || '<p>No demo content entered yet.</p>',
                  createdAt: new Date().toISOString()
                }}
                isPreview={true}
                directContent={demoContent || '<p>No demo content entered yet.</p>'}
              />
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
