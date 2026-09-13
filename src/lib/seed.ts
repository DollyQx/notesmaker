import { prisma } from './db';
import { hashPassword } from './auth';
import {
  INITIAL_CATEGORIES,
  INITIAL_SUBCATEGORIES,
  INITIAL_NOTES,
  INITIAL_STUDENTS,
  INITIAL_PURCHASES
} from './mockData';

export async function seedDatabase() {
  try {
    const userCount = await prisma.user.count();
    if (userCount > 0) {
      return; // Already seeded
    }

    console.log('Seeding SQLite database with default users, categories, notes...');

    // 1. Seed Admin User
    const adminPasswordHash = await hashPassword('admin123');
    const adminUser = await prisma.user.create({
      data: {
        id: 'admin-1',
        name: 'System Admin Manager',
        email: 'admin@notesmaker.in',
        password: adminPasswordHash,
        role: 'ADMIN',
        college: 'NotesMaker HQ'
      }
    });

    // 2. Seed Student User
    const studentPasswordHash = await hashPassword('student123');
    const defaultStudent = await prisma.user.create({
      data: {
        id: 'stud-1',
        name: 'Rahul Sharma',
        email: 'rahul.s@gmail.com',
        password: studentPasswordHash,
        role: 'STUDENT',
        college: 'Delhi Technological University'
      }
    });

    // Seed additional mock students
    for (const stud of INITIAL_STUDENTS) {
      if (stud.id !== 'stud-1') {
        const pass = await hashPassword('student123');
        await prisma.user.create({
          data: {
            id: stud.id,
            name: stud.name,
            email: stud.email,
            password: pass,
            role: 'STUDENT',
            college: stud.college || 'Delhi University'
          }
        });
      }
    }

    // 3. Seed Categories
    for (const cat of INITIAL_CATEGORIES) {
      await prisma.category.create({
        data: {
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          description: cat.description
        }
      });
    }

    // 4. Seed SubCategories
    for (const sub of INITIAL_SUBCATEGORIES) {
      await prisma.subCategory.create({
        data: {
          id: sub.id,
          name: sub.name,
          slug: sub.slug,
          categoryId: sub.categoryId,
          description: sub.description
        }
      });
    }

    // 5. Seed Notes
    for (const note of INITIAL_NOTES) {
      await prisma.note.create({
        data: {
          id: note.id,
          title: note.title,
          slug: note.slug,
          description: note.description,
          price: note.price,
          originalPrice: note.originalPrice,
          pdfUrl: note.pdfUrl || `/api/notes/${note.id}/pdf`,
          categoryId: note.categoryId,
          subCategoryId: note.subCategoryId,
          author: note.author,
          institute: note.institute,
          pages: note.pages,
          fileSize: note.fileSize,
          sampleText: note.sampleText,
          status: 'ACTIVE',
          isBestseller: !!note.isBestseller,
          featured: !!note.featured,
          salesCount: note.salesCount,
          rating: note.rating
        }
      });
    }

    // 6. Seed Purchases
    for (const p of INITIAL_PURCHASES) {
      const studentExists = await prisma.user.findUnique({ where: { id: p.studentId } });
      const noteExists = await prisma.note.findUnique({ where: { id: p.noteId } });

      if (studentExists && noteExists) {
        await prisma.purchase.create({
          data: {
            id: p.id,
            transactionId: p.transactionId,
            studentId: p.studentId,
            noteId: p.noteId,
            amount: p.amount,
            paymentStatus: 'COMPLETED',
            paymentReference: p.transactionId,
            paymentMethod: p.paymentMethod
          }
        });
      }
    }

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}
