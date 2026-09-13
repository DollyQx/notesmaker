'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Category, SubCategory, Note, Student, Purchase } from '@/types';
import {
  INITIAL_CATEGORIES,
  INITIAL_SUBCATEGORIES,
  INITIAL_NOTES,
  INITIAL_STUDENTS,
  INITIAL_PURCHASES
} from '@/lib/mockData';

interface DataContextType {
  categories: Category[];
  subcategories: SubCategory[];
  notes: Note[];
  students: Student[];
  purchases: Purchase[];
  
  // Category CRUD
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  // SubCategory CRUD
  addSubCategory: (subCategory: Omit<SubCategory, 'id'>) => void;
  updateSubCategory: (id: string, subCategory: Partial<SubCategory>) => void;
  deleteSubCategory: (id: string) => void;

  // Note CRUD
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'rating' | 'reviewsCount' | 'salesCount'>) => void;
  updateNote: (id: string, note: Partial<Note>) => void;
  deleteNote: (id: string) => void;

  // Purchase & Student operations
  recordPurchase: (noteId: string, studentId: string, studentName: string, studentEmail: string) => Purchase;
  getNoteById: (id: string) => Note | undefined;
  getCategoryById: (id: string) => Category | undefined;
  getSubCategoryById: (id: string) => SubCategory | undefined;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [subcategories, setSubcategories] = useState<SubCategory[]>(INITIAL_SUBCATEGORIES);
  const [notes, setNotes] = useState<Note[]>(INITIAL_NOTES);
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [purchases, setPurchases] = useState<Purchase[]>(INITIAL_PURCHASES);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on initial render
  useEffect(() => {
    try {
      const savedCat = localStorage.getItem('notesmaker_categories');
      const savedSub = localStorage.getItem('notesmaker_subcategories');
      const savedNotes = localStorage.getItem('notesmaker_notes');
      const savedStud = localStorage.getItem('notesmaker_students');
      const savedPurch = localStorage.getItem('notesmaker_purchases');

      if (savedCat) setCategories(JSON.parse(savedCat));
      if (savedSub) setSubcategories(JSON.parse(savedSub));
      if (savedNotes) setNotes(JSON.parse(savedNotes));
      if (savedStud) setStudents(JSON.parse(savedStud));
      if (savedPurch) setPurchases(JSON.parse(savedPurch));
    } catch (err) {
      console.error('Failed loading data from localStorage', err);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Sync to localStorage
  const saveCategories = (data: Category[]) => {
    setCategories(data);
    localStorage.setItem('notesmaker_categories', JSON.stringify(data));
  };

  const saveSubCategories = (data: SubCategory[]) => {
    setSubcategories(data);
    localStorage.setItem('notesmaker_subcategories', JSON.stringify(data));
  };

  const saveNotes = (data: Note[]) => {
    setNotes(data);
    localStorage.setItem('notesmaker_notes', JSON.stringify(data));
  };

  const savePurchases = (data: Purchase[]) => {
    setPurchases(data);
    localStorage.setItem('notesmaker_purchases', JSON.stringify(data));
  };

  const saveStudents = (data: Student[]) => {
    setStudents(data);
    localStorage.setItem('notesmaker_students', JSON.stringify(data));
  };

  // Category Actions
  const addCategory = (categoryData: Omit<Category, 'id'>) => {
    const newCat: Category = {
      ...categoryData,
      id: `cat-${Date.now()}`,
      subcategoryCount: 0,
      noteCount: 0
    };
    saveCategories([...categories, newCat]);
  };

  const updateCategory = (id: string, updatedFields: Partial<Category>) => {
    saveCategories(categories.map(c => c.id === id ? { ...c, ...updatedFields } : c));
  };

  const deleteCategory = (id: string) => {
    saveCategories(categories.filter(c => c.id !== id));
    // Also remove subcategories linked
    saveSubCategories(subcategories.filter(s => s.categoryId !== id));
  };

  // SubCategory Actions
  const addSubCategory = (subData: Omit<SubCategory, 'id'>) => {
    const newSub: SubCategory = {
      ...subData,
      id: `sub-${Date.now()}`,
      noteCount: 0
    };
    saveSubCategories([...subcategories, newSub]);
  };

  const updateSubCategory = (id: string, updatedFields: Partial<SubCategory>) => {
    saveSubCategories(subcategories.map(s => s.id === id ? { ...s, ...updatedFields } : s));
  };

  const deleteSubCategory = (id: string) => {
    saveSubCategories(subcategories.filter(s => s.id !== id));
  };

  // Note Actions
  const addNote = (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'rating' | 'reviewsCount' | 'salesCount'>) => {
    const cat = categories.find(c => c.id === noteData.categoryId);
    const sub = subcategories.find(s => s.id === noteData.subCategoryId);
    const now = new Date().toISOString().split('T')[0];

    const newNote: Note = {
      ...noteData,
      id: `note-${Date.now()}`,
      categoryName: cat?.name || 'General',
      subCategoryName: sub?.name || 'General',
      rating: 5.0,
      reviewsCount: 1,
      salesCount: 0,
      createdAt: now,
      updatedAt: now
    };
    saveNotes([newNote, ...notes]);
  };

  const updateNote = (id: string, updatedFields: Partial<Note>) => {
    const now = new Date().toISOString().split('T')[0];
    saveNotes(notes.map(n => n.id === id ? { ...n, ...updatedFields, updatedAt: now } : n));
  };

  const deleteNote = (id: string) => {
    saveNotes(notes.filter(n => n.id !== id));
  };

  // Purchase Action
  const recordPurchase = (noteId: string, studentId: string, studentName: string, studentEmail: string): Purchase => {
    const note = notes.find(n => n.id === noteId);
    const txnId = `TXN_${Math.floor(100000000 + Math.random() * 900000000)}`;
    const now = new Date().toLocaleString();

    const newPurchase: Purchase = {
      id: `ord-${Date.now()}`,
      transactionId: txnId,
      studentId,
      studentName,
      studentEmail,
      noteId,
      noteTitle: note?.title || 'Digital Note',
      categoryName: note?.categoryName || 'General',
      amount: note?.price || 0,
      purchaseDate: now,
      paymentMethod: 'UPI (Instant Demo)',
      status: 'completed'
    };

    savePurchases([newPurchase, ...purchases]);

    // Increment note sales count
    if (note) {
      updateNote(note.id, { salesCount: (note.salesCount || 0) + 1 });
    }

    // Update student expenditure if found or add student
    const existingStudent = students.find(s => s.email === studentEmail);
    if (existingStudent) {
      saveStudents(students.map(s => s.id === existingStudent.id ? {
        ...s,
        purchasesCount: s.purchasesCount + 1,
        totalSpent: s.totalSpent + (note?.price || 0)
      } : s));
    } else {
      const newStudent: Student = {
        id: studentId,
        name: studentName,
        email: studentEmail,
        joinedDate: new Date().toISOString().split('T')[0],
        purchasesCount: 1,
        totalSpent: note?.price || 0,
        status: 'active'
      };
      saveStudents([...students, newStudent]);
    }

    return newPurchase;
  };

  const getNoteById = (id: string) => notes.find(n => n.id === id);
  const getCategoryById = (id: string) => categories.find(c => c.id === id);
  const getSubCategoryById = (id: string) => subcategories.find(s => s.id === id);

  return (
    <DataContext.Provider
      value={{
        categories,
        subcategories,
        notes,
        students,
        purchases,
        addCategory,
        updateCategory,
        deleteCategory,
        addSubCategory,
        updateSubCategory,
        deleteSubCategory,
        addNote,
        updateNote,
        deleteNote,
        recordPurchase,
        getNoteById,
        getCategoryById,
        getSubCategoryById
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
