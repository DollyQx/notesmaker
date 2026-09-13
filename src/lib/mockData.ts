import { Category, SubCategory, Note, Student, Purchase } from '@/types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    name: 'Computer Science & Tech',
    slug: 'computer-science-tech',
    icon: 'Code',
    description: 'Data Structures, Algorithms, Web Dev, OS, and System Design handwritten notes.',
    subcategoryCount: 4,
    noteCount: 12
  },
  {
    id: 'cat-2',
    name: 'Engineering (B.Tech)',
    slug: 'engineering-btech',
    icon: 'Cpu',
    description: 'Mechanical, Electronics, Civil, and Electrical semester toppers notes.',
    subcategoryCount: 4,
    noteCount: 8
  },
  {
    id: 'cat-3',
    name: 'Medical & NEET-UG',
    slug: 'medical-neet-ug',
    icon: 'Stethoscope',
    description: 'Biology diagrams, High-yield Chemistry formulas, & Physics shortcuts.',
    subcategoryCount: 3,
    noteCount: 9
  },
  {
    id: 'cat-4',
    name: 'UPSC & Civil Services',
    slug: 'upsc-civil-services',
    icon: 'BookOpen',
    description: 'Polity, Indian History, Modern Geography & Current Affairs summary notes.',
    subcategoryCount: 4,
    noteCount: 15
  },
  {
    id: 'cat-5',
    name: 'Commerce & CA',
    slug: 'commerce-ca',
    icon: 'TrendingUp',
    description: 'Financial Accounting, Taxation, Corporate Law, and Auditing cheat sheets.',
    subcategoryCount: 3,
    noteCount: 6
  }
];

export const INITIAL_SUBCATEGORIES: SubCategory[] = [
  {
    id: 'sub-1',
    categoryId: 'cat-1',
    categoryName: 'Computer Science & Tech',
    name: 'Data Structures & Algorithms',
    slug: 'dsa',
    description: 'Arrays, Trees, Graphs, Dynamic Programming & Sorting',
    noteCount: 4
  },
  {
    id: 'sub-2',
    categoryId: 'cat-1',
    categoryName: 'Computer Science & Tech',
    name: 'Full Stack Web Development',
    slug: 'web-development',
    description: 'React, Next.js, Node.js, Express, & MongoDB notes',
    noteCount: 3
  },
  {
    id: 'sub-3',
    categoryId: 'cat-1',
    categoryName: 'Computer Science & Tech',
    name: 'Operating Systems & DBMS',
    slug: 'os-dbms',
    description: 'Process scheduling, Memory management, SQL & Indexing',
    noteCount: 3
  },
  {
    id: 'sub-4',
    categoryId: 'cat-1',
    categoryName: 'Computer Science & Tech',
    name: 'System Design & DevOps',
    slug: 'system-design',
    description: 'Scalability, Load balancers, Microservices & Docker',
    noteCount: 2
  },
  {
    id: 'sub-5',
    categoryId: 'cat-2',
    categoryName: 'Engineering (B.Tech)',
    name: 'Electronics & Communication',
    slug: 'ece',
    description: 'Signals & Systems, Digital Signal Processing, Analog Circuits',
    noteCount: 3
  },
  {
    id: 'sub-6',
    categoryId: 'cat-2',
    categoryName: 'Engineering (B.Tech)',
    name: 'Mechanical Engineering',
    slug: 'mechanical',
    description: 'Thermodynamics, Fluid Mechanics, Strength of Materials',
    noteCount: 3
  },
  {
    id: 'sub-7',
    categoryId: 'cat-3',
    categoryName: 'Medical & NEET-UG',
    name: 'Human Anatomy & Physiology',
    slug: 'anatomy',
    description: 'Labeled diagrams, organ systems, and physiological pathways',
    noteCount: 4
  },
  {
    id: 'sub-8',
    categoryId: 'cat-3',
    categoryName: 'Medical & NEET-UG',
    name: 'Organic & Inorganic Chemistry',
    slug: 'neet-chemistry',
    description: 'Reaction mechanisms, periodic trends, named reactions',
    noteCount: 3
  },
  {
    id: 'sub-9',
    categoryId: 'cat-4',
    categoryName: 'UPSC & Civil Services',
    name: 'Indian Polity & Governance',
    slug: 'indian-polity',
    description: 'Constitutional articles, Supreme Court landmark cases, amendments',
    noteCount: 5
  },
  {
    id: 'sub-10',
    categoryId: 'cat-4',
    categoryName: 'UPSC & Civil Services',
    name: 'Modern Indian History',
    slug: 'modern-history',
    description: 'Freedom struggle timeline, viceroys, acts, and movements',
    noteCount: 4
  }
];

export const INITIAL_NOTES: Note[] = [
  {
    id: 'note-101',
    title: 'Complete DSA Master Notes with Visual Mindmaps',
    slug: 'complete-dsa-master-notes',
    description: 'Handwritten, crisp notes covering Arrays, Linked Lists, Binary Trees, Graphs, Dynamic Programming, and 150+ solved LeetCode patterns with color diagrams.',
    categoryId: 'cat-1',
    categoryName: 'Computer Science & Tech',
    subCategoryId: 'sub-1',
    subCategoryName: 'Data Structures & Algorithms',
    price: 199,
    originalPrice: 499,
    author: 'Aman Sharma (Ex-IIT Delhi / SDE-2)',
    institute: 'IIT Delhi',
    pages: 142,
    fileSize: '14.8 MB',
    rating: 4.9,
    reviewsCount: 328,
    salesCount: 1420,
    featured: true,
    isBestseller: true,
    sampleText: `CHAPTER 1: TIME & SPACE COMPLEXITY ANALYSIS

1. Big-O Notation (Upper Bound)
- Defines the maximum time required by an algorithm for a given input size (N).
- Example: Linear Search O(N), Binary Search O(log N).

2. Core Data Structure Architectures:
- Array: Contiguous memory allocation, O(1) random access by index.
- Linked List: Node-based structure with memory pointers [Data | Next].
- Binary Search Tree: Left child < Node < Right child. Average search O(log N).

3. Dynamic Programming Top Patterns:
a) 0/1 Knapsack Pattern
b) Unbounded Knapsack Pattern
c) Longest Common Subsequence (LCS)
d) Matrix Chain Multiplication (MCM)`,
    pdfUrl: '/api/notes/note-101/pdf',
    tags: ['DSA', 'LeetCode', 'Coding Interview', 'Handwritten', 'Placement'],
    createdAt: '2026-01-15',
    updatedAt: '2026-02-10'
  },
  {
    id: 'note-102',
    title: 'Indian Polity (M. Laxmikanth 6th Ed Summary)',
    slug: 'indian-polity-summary-notes',
    description: 'Ultra-concise, exam-oriented revision notes for UPSC Prelims & Mains. Includes mind maps of Fundamental Rights, Directive Principles, and Constitutional Bodies.',
    categoryId: 'cat-4',
    categoryName: 'UPSC & Civil Services',
    subCategoryId: 'sub-9',
    subCategoryName: 'Indian Polity & Governance',
    price: 149,
    originalPrice: 399,
    author: 'Priya Verma (UPSC AIR 42 Ranker)',
    institute: 'Drishti Academy / St. Stephen\'s',
    pages: 98,
    fileSize: '11.2 MB',
    rating: 4.8,
    reviewsCount: 215,
    salesCount: 890,
    featured: true,
    isPopular: true,
    sampleText: `PART I: CONSTITUTIONAL FRAMEWORK

1. Making of the Constitution:
- Constituent Assembly constituted in Nov 1946 under Cabinet Mission Plan.
- Drafting Committee Chairman: Dr. B.R. Ambedkar.
- Adopted on Nov 26, 1949; came into force on Jan 26, 1950.

2. Fundamental Rights (Article 12 - 35):
- Right to Equality (Art 14 - 18)
- Right to Freedom (Art 19 - 22)
- Right against Exploitation (Art 23 - 24)
- Right to Freedom of Religion (Art 25 - 28)
- Cultural & Educational Rights (Art 29 - 30)
- Constitutional Remedies (Art 32 - Heart & Soul of Constitution)`,
    pdfUrl: '/api/notes/note-102/pdf',
    tags: ['UPSC', 'IAS', 'Polity', 'Laxmikanth', 'Civil Services'],
    createdAt: '2026-01-20',
    updatedAt: '2026-03-01'
  },
  {
    id: 'note-103',
    title: 'Full Stack React & Next.js Architecture Notes',
    slug: 'react-nextjs-architecture-notes',
    description: 'Modern Web Development guide featuring Server Components, App Router, Zustand, React Query, API Route optimization, and Tailwind CSS cheatsheets.',
    categoryId: 'cat-1',
    categoryName: 'Computer Science & Tech',
    subCategoryId: 'sub-2',
    subCategoryName: 'Full Stack Web Development',
    price: 179,
    originalPrice: 349,
    author: 'Rohan Gupta (Senior Web Architect)',
    institute: 'BITS Pilani',
    pages: 86,
    fileSize: '8.5 MB',
    rating: 4.9,
    reviewsCount: 142,
    salesCount: 650,
    featured: true,
    isBestseller: false,
    sampleText: `MODULE 1: NEXT.JS APP ROUTER MENTAL MODEL

1. Server Components vs Client Components
- Server Components (Default): Render on server, ZERO JS bundle sent to client.
- Client Components ('use client'): Render on server HTML then hydrate on client for interactivity (useState, useEffect, onClick).

2. Data Fetching Strategies:
- Server-side rendering (dynamic): fetch(url, { cache: 'no-store' })
- Static Site Generation (SSG): fetch(url, { next: { revalidate: 3600 } })
- Client-side fetch with React Query / SWR for polling & real-time updates.`,
    pdfUrl: '/api/notes/note-103/pdf',
    tags: ['React', 'NextJS', 'TypeScript', 'WebDev', 'Frontend'],
    createdAt: '2026-02-01',
    updatedAt: '2026-03-05'
  },
  {
    id: 'note-104',
    title: 'NEET Human Biology & Diagrams Workbook',
    slug: 'neet-human-biology-diagrams',
    description: 'High-yield NCERT revision notes with 100+ color-coded hand-drawn labeled diagrams for quick memorization before NEET 2026.',
    categoryId: 'cat-3',
    categoryName: 'Medical & NEET-UG',
    subCategoryId: 'sub-7',
    subCategoryName: 'Human Anatomy & Physiology',
    price: 129,
    originalPrice: 299,
    author: 'Dr. Sneha Reddy (MBBS AIIMS)',
    institute: 'AIIMS New Delhi',
    pages: 110,
    fileSize: '18.4 MB',
    rating: 4.7,
    reviewsCount: 184,
    salesCount: 710,
    featured: false,
    isPopular: true,
    sampleText: `UNIT 5: HUMAN PHYSIOLOGY SUMMARY

1. Digestion & Absorption:
- Alimentary Canal: Mouth -> Esophagus -> Stomach -> Small Intestine -> Large Intestine.
- Stomach Secretions: Pepsinogen (converted by HCl to Pepsin), Mucus, Intrinsic Factor.

2. Neural Control & Coordination:
- Neuron structure: Cyton, Axon, Dendrites, Synaptic knob.
- Action potential propagation along myelinated vs non-myelinated fibers.`,
    pdfUrl: '/api/notes/note-104/pdf',
    tags: ['NEET', 'Biology', 'NCERT', 'Medical', 'Handdrawn Diagrams'],
    createdAt: '2026-01-10',
    updatedAt: '2026-02-25'
  },
  {
    id: 'note-105',
    title: 'CA Inter Financial Management & Accounting Formulas',
    slug: 'ca-inter-fm-accounting-formulas',
    description: 'Formula revision guide, ratio analysis tables, cash flow statements, and previous year solved questions for CA Intermediate exams.',
    categoryId: 'cat-5',
    categoryName: 'Commerce & CA',
    subCategoryId: 'sub-3',
    subCategoryName: 'Operating Systems & DBMS',
    price: 159,
    originalPrice: 349,
    author: 'CA Vikram Mehta',
    institute: 'ICAI Top Ranker',
    pages: 76,
    fileSize: '6.9 MB',
    rating: 4.6,
    reviewsCount: 96,
    salesCount: 420,
    featured: false,
    sampleText: `FINANCIAL MANAGEMENT QUICK FORMULAS

1. Cost of Capital (Ka):
- Cost of Equity (Ke) = (D1 / P0) + g
- Weighted Average Cost of Capital (WACC) = Sum of (Weight * Specific Cost)

2. Capital Structure Ratios:
- Debt to Equity = Total Debt / Shareholder Equity
- Interest Coverage Ratio = EBIT / Interest Expense`,
    pdfUrl: '/api/notes/note-105/pdf',
    tags: ['CA Inter', 'Finance', 'ICAI', 'Accounting', 'Commerce'],
    createdAt: '2026-02-15',
    updatedAt: '2026-03-02'
  },
  {
    id: 'note-106',
    title: 'Operating Systems & System Call Architecture',
    slug: 'operating-systems-system-calls',
    description: 'Detailed process management, deadlocks, semaphore synchronization, paging, virtual memory, and Unix system calls with diagrams.',
    categoryId: 'cat-1',
    categoryName: 'Computer Science & Tech',
    subCategoryId: 'sub-3',
    subCategoryName: 'Operating Systems & DBMS',
    price: 119,
    originalPrice: 249,
    author: 'Karan Patel',
    institute: 'IIT Bombay',
    pages: 64,
    fileSize: '7.2 MB',
    rating: 4.8,
    reviewsCount: 78,
    salesCount: 340,
    featured: false,
    sampleText: `OPERATING SYSTEM CORE CONCEPTS

1. Process vs Thread:
- Process: Program in execution with isolated memory space.
- Thread: Lightweight process sharing memory address space.

2. Deadlock 4 Necessary Conditions:
a) Mutual Exclusion
b) Hold and Wait
c) No Preemption
d) Circular Wait`,
    pdfUrl: '/api/notes/note-106/pdf',
    tags: ['OS', 'Linux', 'Semaphores', 'GATE CS', 'University Notes'],
    createdAt: '2026-02-18',
    updatedAt: '2026-03-04'
  }
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'stud-1',
    name: 'Rahul Sharma',
    email: 'rahul.s@gmail.com',
    phone: '+91 98765 43210',
    college: 'Delhi Technological University (DTU)',
    joinedDate: '2026-01-12',
    purchasesCount: 2,
    totalSpent: 348,
    status: 'active'
  },
  {
    id: 'stud-2',
    name: 'Ananya Roy',
    email: 'ananya.roy@yahoo.com',
    phone: '+91 98123 76543',
    college: 'Delhi University (Hindu College)',
    joinedDate: '2026-01-18',
    purchasesCount: 1,
    totalSpent: 149,
    status: 'active'
  },
  {
    id: 'stud-3',
    name: 'Kartik Iyer',
    email: 'kartik.i@outlook.com',
    phone: '+91 97654 12389',
    college: 'Vellore Institute of Technology (VIT)',
    joinedDate: '2026-02-02',
    purchasesCount: 3,
    totalSpent: 507,
    status: 'active'
  },
  {
    id: 'stud-4',
    name: 'Meera Deshmukh',
    email: 'meera.d@gmail.com',
    phone: '+91 99887 66554',
    college: 'Grant Medical College Mumbai',
    joinedDate: '2026-02-14',
    purchasesCount: 1,
    totalSpent: 129,
    status: 'active'
  }
];

export const INITIAL_PURCHASES: Purchase[] = [
  {
    id: 'ord-1001',
    transactionId: 'TXN_892341908',
    studentId: 'stud-1',
    studentName: 'Rahul Sharma',
    studentEmail: 'rahul.s@gmail.com',
    noteId: 'note-101',
    noteTitle: 'Complete DSA Master Notes with Visual Mindmaps',
    categoryName: 'Computer Science & Tech',
    amount: 199,
    purchaseDate: '2026-02-10 14:32',
    paymentMethod: 'UPI (GPay)',
    status: 'completed'
  },
  {
    id: 'ord-1002',
    transactionId: 'TXN_892341909',
    studentId: 'stud-1',
    studentName: 'Rahul Sharma',
    studentEmail: 'rahul.s@gmail.com',
    noteId: 'note-102',
    noteTitle: 'Indian Polity (M. Laxmikanth 6th Ed Summary)',
    categoryName: 'UPSC & Civil Services',
    amount: 149,
    purchaseDate: '2026-02-12 11:15',
    paymentMethod: 'UPI (PhonePe)',
    status: 'completed'
  },
  {
    id: 'ord-1003',
    transactionId: 'TXN_892341910',
    studentId: 'stud-2',
    studentName: 'Ananya Roy',
    studentEmail: 'ananya.roy@yahoo.com',
    noteId: 'note-102',
    noteTitle: 'Indian Polity (M. Laxmikanth 6th Ed Summary)',
    categoryName: 'UPSC & Civil Services',
    amount: 149,
    purchaseDate: '2026-02-20 18:45',
    paymentMethod: 'Credit Card',
    status: 'completed'
  },
  {
    id: 'ord-1004',
    transactionId: 'TXN_892341911',
    studentId: 'stud-3',
    studentName: 'Kartik Iyer',
    studentEmail: 'kartik.i@outlook.com',
    noteId: 'note-103',
    noteTitle: 'Full Stack React & Next.js Architecture Notes',
    categoryName: 'Computer Science & Tech',
    amount: 179,
    purchaseDate: '2026-03-01 09:20',
    paymentMethod: 'UPI (Paytm)',
    status: 'completed'
  }
];
