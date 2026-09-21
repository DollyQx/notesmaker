import { prisma } from './db';
import { hashPassword } from './auth';
import {
  INITIAL_CATEGORIES,
  INITIAL_SUBCATEGORIES,
  INITIAL_NOTES,
  INITIAL_STUDENTS,
  INITIAL_PURCHASES
} from './mockData';

export async function seedProductionDatabase() {
  const adminPassword = process.env.NOTESMAKER_ADMIN_PASSWORD;

  if (!adminPassword || adminPassword.trim().length === 0) {
    console.error('\n================================================================');
    console.error('CRITICAL SEED ERROR: NOTESMAKER_ADMIN_PASSWORD environment variable is missing!');
    console.error('Please set NOTESMAKER_ADMIN_PASSWORD before running the seed command.');
    console.error('================================================================\n');
    throw new Error('NOTESMAKER_ADMIN_PASSWORD environment variable is required to seed the database.');
  }

  console.log('Initializing production database (Admin user, Categories, and SubCategories)...');

  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@notesmaker.in').toLowerCase().trim();
  const adminPasswordHash = await hashPassword(adminPassword.trim());

  // 1. Seed or update Admin User idempotently
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  });

  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        id: 'admin-1',
        name: 'System Admin Manager',
        email: adminEmail,
        password: adminPasswordHash,
        role: 'ADMIN',
        college: 'NotesMaker HQ'
      }
    });
    console.log(`[SEED] Initial admin created for: ${adminEmail}`);
  } else {
    await prisma.user.update({
      where: { email: adminEmail },
      data: {
        password: adminPasswordHash,
        role: 'ADMIN'
      }
    });
    console.log(`[SEED] Admin credentials updated for: ${adminEmail}`);
  }

  // 2. Seed Core Categories idempotently
  for (const cat of INITIAL_CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description
      },
      create: {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description
      }
    });
  }
  console.log(`[SEED] Seeded ${INITIAL_CATEGORIES.length} core categories.`);

  // 3. Seed Core SubCategories idempotently
  for (const sub of INITIAL_SUBCATEGORIES) {
    await prisma.subCategory.upsert({
      where: { slug: sub.slug },
      update: {
        name: sub.name,
        categoryId: sub.categoryId,
        description: sub.description
      },
      create: {
        id: sub.id,
        name: sub.name,
        slug: sub.slug,
        categoryId: sub.categoryId,
        description: sub.description
      }
    });
  }
  console.log(`[SEED] Seeded ${INITIAL_SUBCATEGORIES.length} core subcategories.`);

  // Optional: Seed demo data ONLY if explicitly requested via environment variable SEED_DEMO_DATA=true
  if (process.env.SEED_DEMO_DATA === 'true') {
    console.log('[SEED] SEED_DEMO_DATA=true detected. Seeding demo students, notes, and purchases...');
    await seedDemoData();
  }

  console.log('[SEED] Database seeding completed successfully.');
}

async function seedDemoData() {
  for (const stud of INITIAL_STUDENTS) {
    const studentPass = await hashPassword('student123');
    await prisma.user.upsert({
      where: { email: stud.email.toLowerCase() },
      update: {},
      create: {
        id: stud.id,
        name: stud.name,
        email: stud.email.toLowerCase(),
        password: studentPass,
        role: 'STUDENT',
        college: stud.college || 'Delhi University'
      }
    });
  }

  for (const note of INITIAL_NOTES) {
    await prisma.note.upsert({
      where: { slug: note.slug },
      update: {},
      create: {
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

  for (const p of INITIAL_PURCHASES) {
    const studentExists = await prisma.user.findUnique({ where: { id: p.studentId } });
    const noteExists = await prisma.note.findUnique({ where: { id: p.noteId } });

    if (studentExists && noteExists) {
      const existingPurchase = await prisma.purchase.findUnique({ where: { transactionId: p.transactionId } });
      if (!existingPurchase) {
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
  }
}

export const seedDatabase = seedProductionDatabase;

if (require.main === module || process.argv[1]?.includes('seed')) {
  seedProductionDatabase()
    .then(() => {
      process.exit(0);
    })
    .catch((err) => {
      console.error('Seeding process failed:', err.message || err);
      process.exit(1);
    });
}

