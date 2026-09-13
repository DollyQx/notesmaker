'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: 'STUDENT' | 'ADMIN';
  college?: string;
}

interface AuthContextType {
  user: UserSession | null;
  purchasedNoteIds: string[];
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string, college?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  unlockNote: (noteId: string) => Promise<{ success: boolean; error?: string }>;
  hasPurchased: (noteId: string) => boolean;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSession | null>(null);
  const [purchasedNoteIds, setPurchasedNoteIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPurchases = async () => {
    try {
      const res = await fetch('/api/purchases');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.purchasedNoteIds)) {
          setPurchasedNoteIds(data.purchasedNoteIds);
        }
      }
    } catch (error) {
      console.error('Error fetching purchases:', error);
    }
  };

  const refreshAuth = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          setUser({
            id: data.user.userId || data.user.id,
            name: data.user.name,
            email: data.user.email,
            role: data.user.role,
            college: data.user.college
          });
          await fetchPurchases();
        } else {
          setUser(null);
          setPurchasedNoteIds([]);
        }
      } else {
        setUser(null);
        setPurchasedNoteIds([]);
      }
    } catch (error) {
      setUser(null);
      setPurchasedNoteIds([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        await fetchPurchases();
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Invalid credentials' };
      }
    } catch (error: any) {
      return { success: false, error: 'Network or server error during login' };
    }
  };

  const register = async (name: string, email: string, password: string, college?: string) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, college })
      });

      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        await fetchPurchases();
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Registration failed' };
      }
    } catch (error: any) {
      return { success: false, error: 'Network error during registration' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setPurchasedNoteIds([]);
    }
  };

  const unlockNote = async (noteId: string) => {
    if (!user) {
      return { success: false, error: 'Please sign in to purchase notes' };
    }

    try {
      const res = await fetch('/api/purchases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ noteId })
      });

      const data = await res.json();
      if (data.success) {
        setPurchasedNoteIds((prev) => Array.from(new Set([...prev, noteId])));
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Failed to unlock note' };
      }
    } catch (error) {
      return { success: false, error: 'Network error processing purchase' };
    }
  };

  const hasPurchased = (noteId: string) => {
    if (user?.role === 'ADMIN') return true;
    return purchasedNoteIds.includes(noteId);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        purchasedNoteIds,
        isLoading,
        login,
        register,
        logout,
        unlockNote,
        hasPurchased,
        refreshAuth
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
