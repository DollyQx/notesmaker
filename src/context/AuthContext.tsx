'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserSession } from '@/types';

interface AuthContextType {
  user: UserSession | null;
  purchasedNoteIds: string[];
  loginAsStudent: (email?: string, name?: string) => void;
  loginAsAdmin: (email?: string) => void;
  logout: () => void;
  hasPurchased: (noteId: string) => boolean;
  addPurchasedNote: (noteId: string) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_STUDENT: UserSession = {
  id: 'stud-1',
  name: 'Rahul Sharma',
  email: 'rahul.s@gmail.com',
  role: 'student',
  college: 'Delhi Technological University'
};

const DEFAULT_ADMIN: UserSession = {
  id: 'admin-1',
  name: 'Admin Manager',
  email: 'admin@notesmaker.in',
  role: 'admin'
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSession | null>(null);
  const [purchasedNoteIds, setPurchasedNoteIds] = useState<string[]>(['note-101', 'note-102']);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('notesmaker_user');
      const savedPurchases = localStorage.getItem('notesmaker_purchased_ids');

      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        // Default demo login as student for seamless testing
        setUser(DEFAULT_STUDENT);
        localStorage.setItem('notesmaker_user', JSON.stringify(DEFAULT_STUDENT));
      }

      if (savedPurchases) {
        setPurchasedNoteIds(JSON.parse(savedPurchases));
      } else {
        localStorage.setItem('notesmaker_purchased_ids', JSON.stringify(['note-101', 'note-102']));
      }
    } catch (e) {
      console.error('Error restoring auth state:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginAsStudent = (email = 'student@notesmaker.in', name = 'Demo Student') => {
    const studentUser: UserSession = {
      id: 'stud-' + Date.now(),
      name,
      email,
      role: 'student',
      college: 'Delhi University'
    };
    setUser(studentUser);
    localStorage.setItem('notesmaker_user', JSON.stringify(studentUser));
  };

  const loginAsAdmin = (email = 'admin@notesmaker.in') => {
    setUser(DEFAULT_ADMIN);
    localStorage.setItem('notesmaker_user', JSON.stringify(DEFAULT_ADMIN));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('notesmaker_user');
  };

  const hasPurchased = (noteId: string) => {
    if (user?.role === 'admin') return true; // Admin gets preview access
    return purchasedNoteIds.includes(noteId);
  };

  const addPurchasedNote = (noteId: string) => {
    if (!purchasedNoteIds.includes(noteId)) {
      const updated = [...purchasedNoteIds, noteId];
      setPurchasedNoteIds(updated);
      localStorage.setItem('notesmaker_purchased_ids', JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        purchasedNoteIds,
        loginAsStudent,
        loginAsAdmin,
        logout,
        hasPurchased,
        addPurchasedNote,
        isLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
