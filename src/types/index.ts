export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  description: string;
  subcategoryCount?: number;
  noteCount?: number;
}

export interface SubCategory {
  id: string;
  categoryId: string;
  categoryName?: string;
  name: string;
  slug: string;
  description?: string;
  noteCount?: number;
}

export interface Note {
  id: string;
  title: string;
  slug: string;
  description: string;
  categoryId: string;
  categoryName: string;
  subCategoryId: string;
  subCategoryName: string;
  price: number;
  originalPrice?: number;
  author: string;
  institute?: string;
  pages: number;
  fileSize: string;
  rating: number;
  reviewsCount: number;
  salesCount: number;
  featured?: boolean;
  isPopular?: boolean;
  isBestseller?: boolean;
  sampleText?: string;
  pdfUrl?: string; // Internal protected reference
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  phone?: string;
  college?: string;
  joinedDate: string;
  purchasesCount: number;
  totalSpent: number;
  status: 'active' | 'blocked';
}

export interface Purchase {
  id: string;
  transactionId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  noteId: string;
  noteTitle: string;
  categoryName: string;
  amount: number;
  purchaseDate: string;
  paymentMethod: string;
  status: 'completed' | 'failed' | 'refunded';
}

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  college?: string;
}
