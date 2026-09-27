import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { DataProvider } from '@/context/DataContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://notesstudy.online'),
  title: {
    default: 'Notes Study | Topper Handwritten Digital Notes Marketplace',
    template: '%s | Notes Study'
  },
  description: 'Instant online PDF reader for university & competitive exam notes. High-yield DSA, Polity, NEET, Engineering, and Commerce study materials.',
  keywords: ['Notes Study', 'digital notes', 'handwritten notes', 'DSA notes', 'UPSC polity notes', 'NEET biology notes', 'exam toppers notes', 'pdf reader', 'notesstudy.online'],
  authors: [{ name: 'Notes Study Team' }],
  creator: 'Notes Study',
  publisher: 'Notes Study',
  openGraph: {
    title: 'Notes Study | Topper Handwritten Digital Notes Marketplace',
    description: 'Instant online PDF reader for university & competitive exam notes. High-yield toppers study materials.',
    url: 'https://notesstudy.online',
    siteName: 'Notes Study',
    locale: 'en_IN',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Notes Study | Topper Handwritten Digital Notes Marketplace',
    description: 'Instant online PDF reader for university & competitive exam notes.'
  },
  robots: {
    index: true,
    follow: true
  }
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
