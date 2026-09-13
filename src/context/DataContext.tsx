'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Category, SubCategory, Note, Student, Purchase } from '@/types';

interface DataContextType {
  categories: Category[];
  subcategories: SubCategory[];
  notes: Note[];
  students: Student[];
  purchases: Purchase[];
  isLoading: boolean;
  
  // Refresh methods
  refreshCategories: () => Promise<void>;
  refreshSubCategories: () => Promise<void>;
  refreshNotes: () => Promise<void>;
  refreshAll: () => Promise<void>;

  // Category CRUD
  addCategory: (data: { name: string; description?: string }) => Promise<{ success: boolean; error?: string }>;
  updateCategory: (id: string, data: { name?: string; description?: string }) => Promise<{ success: boolean; error?: string }>;
  deleteCategory: (id: string) => Promise<{ success: boolean; error?: string }>;

  // SubCategory CRUD
  addSubCategory: (data: { name: string; categoryId: string; description?: string }) => Promise<{ success: boolean; error?: string }>;
  updateSubCategory: (id: string, data: { name?: string; categoryId?: string; description?: string }) => Promise<{ success: boolean; error?: string }>;
  deleteSubCategory: (id: string) => Promise<{ success: boolean; error?: string }>;

  // Note CRUD
  addNote: (noteData: Partial<Note>) => Promise<{ success: boolean; error?: string }>;
  updateNote: (id: string, noteData: Partial<Note>) => Promise<{ success: boolean; error?: string }>;
  deleteNote: (id: string) => Promise<{ success: boolean; error?: string }>;

  // Helpers
  getNoteById: (id: string) => Note | undefined;
  getNotesByCategory: (categoryId: string) => Note[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        if (data.success) setCategories(data.categories);
      }
    } catch (e) {
      console.error('Error fetching categories:', e);
    }
  };

  const refreshSubCategories = async () => {
    try {
      const res = await fetch('/api/subcategories');
      if (res.ok) {
        const data = await res.json();
        if (data.success) setSubcategories(data.subcategories);
      }
    } catch (e) {
      console.error('Error fetching subcategories:', e);
    }
  };

  const refreshNotes = async () => {
    try {
      const res = await fetch('/api/notes');
      if (res.ok) {
        const data = await res.json();
        if (data.success) setNotes(data.notes);
      }
    } catch (e) {
      console.error('Error fetching notes:', e);
    }
  };

  const refreshAll = async () => {
    setIsLoading(true);
    await Promise.all([
      refreshCategories(),
      refreshSubCategories(),
      refreshNotes()
    ]);
    setIsLoading(false);
  };

  useEffect(() => {
    refreshAll();
  }, []);

  // Category CRUD
  const addCategory = async (data: { name: string; description?: string }) => {
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const resData = await res.json();
      if (resData.success) {
        await refreshCategories();
        return { success: true };
      } else {
        return { success: false, error: resData.error };
      }
    } catch (e: any) {
      return { success: false, error: 'Network error adding category' };
    }
  };

  const updateCategory = async (id: string, data: { name?: string; description?: string }) => {
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const resData = await res.json();
      if (resData.success) {
        await refreshCategories();
        return { success: true };
      } else {
        return { success: false, error: resData.error };
      }
    } catch (e) {
      return { success: false, error: 'Network error updating category' };
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      const resData = await res.json();
      if (resData.success) {
        await refreshCategories();
        return { success: true };
      } else {
        return { success: false, error: resData.error };
      }
    } catch (e) {
      return { success: false, error: 'Network error deleting category' };
    }
  };

  // SubCategory CRUD
  const addSubCategory = async (data: { name: string; categoryId: string; description?: string }) => {
    try {
      const res = await fetch('/api/subcategories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const resData = await res.json();
      if (resData.success) {
        await refreshSubCategories();
        return { success: true };
      } else {
        return { success: false, error: resData.error };
      }
    } catch (e) {
      return { success: false, error: 'Network error adding sub-category' };
    }
  };

  const updateSubCategory = async (id: string, data: { name?: string; categoryId?: string; description?: string }) => {
    try {
      const res = await fetch(`/api/subcategories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const resData = await res.json();
      if (resData.success) {
        await refreshSubCategories();
        return { success: true };
      } else {
        return { success: false, error: resData.error };
      }
    } catch (e) {
      return { success: false, error: 'Network error updating sub-category' };
    }
  };

  const deleteSubCategory = async (id: string) => {
    try {
      const res = await fetch(`/api/subcategories/${id}`, { method: 'DELETE' });
      const resData = await res.json();
      if (resData.success) {
        await refreshSubCategories();
        return { success: true };
      } else {
        return { success: false, error: resData.error };
      }
    } catch (e) {
      return { success: false, error: 'Network error deleting sub-category' };
    }
  };

  // Note CRUD
  const addNote = async (noteData: Partial<Note>) => {
    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(noteData)
      });
      const resData = await res.json();
      if (resData.success) {
        await refreshNotes();
        return { success: true };
      } else {
        return { success: false, error: resData.error };
      }
    } catch (e) {
      return { success: false, error: 'Network error publishing note' };
    }
  };

  const updateNote = async (id: string, noteData: Partial<Note>) => {
    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(noteData)
      });
      const resData = await res.json();
      if (resData.success) {
        await refreshNotes();
        return { success: true };
      } else {
        return { success: false, error: resData.error };
      }
    } catch (e) {
      return { success: false, error: 'Network error updating note' };
    }
  };

  const deleteNote = async (id: string) => {
    try {
      const res = await fetch(`/api/notes/${id}`, { method: 'DELETE' });
      const resData = await res.json();
      if (resData.success) {
        await refreshNotes();
        return { success: true };
      } else {
        return { success: false, error: resData.error };
      }
    } catch (e) {
      return { success: false, error: 'Network error deleting note' };
    }
  };

  const getNoteById = (id: string) => notes.find((n) => n.id === id);
  const getNotesByCategory = (categoryId: string) => notes.filter((n) => n.categoryId === categoryId);

  return (
    <DataContext.Provider
      value={{
        categories,
        subcategories,
        notes,
        students,
        purchases,
        isLoading,
        refreshCategories,
        refreshSubCategories,
        refreshNotes,
        refreshAll,
        addCategory,
        updateCategory,
        deleteCategory,
        addSubCategory,
        updateSubCategory,
        deleteSubCategory,
        addNote,
        updateNote,
        deleteNote,
        getNoteById,
        getNotesByCategory
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
