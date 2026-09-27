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

export const INITIAL_NOTES: Note[] = [];
export const INITIAL_STUDENTS: Student[] = [];
export const INITIAL_PURCHASES: Purchase[] = [];

