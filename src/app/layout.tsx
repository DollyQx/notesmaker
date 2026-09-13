import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { DataProvider } from '@/context/DataContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NotesMaker | Topper Handwritten Digital Notes Marketplace',
  description: 'Instant online PDF reader for university & competitive exam notes. High-yield DSA, Polity, NEET, Engineering, and Commerce study materials.',
  keywords: ['digital notes', 'handwritten notes', 'DSA notes', 'UPSC polity notes', 'NEET biology notes', 'exam toppers notes', 'pdf reader']
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className={`${inter.className} bg-slate-50 text-slate-900 min-h-full flex flex-col antialiased`}>
        <AuthProvider>
          <DataProvider>
            {children}
          </DataProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
