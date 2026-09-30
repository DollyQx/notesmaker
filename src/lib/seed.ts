import { prisma } from './db';
import { hashPassword } from './auth';
import {
  INITIAL_CATEGORIES,
  INITIAL_SUBCATEGORIES
} from './mockData';

export async function seedProductionDatabase() {
  const adminEmail = (
    process.env.NOTES_STUDY_ADMIN_EMAIL ||
    process.env.NOTESMAKER_ADMIN_EMAIL ||
    process.env.ADMIN_EMAIL ||
    ''
  ).toLowerCase().trim();

  const adminPassword = (
    process.env.NOTES_STUDY_ADMIN_PASSWORD ||
    process.env.NOTESMAKER_ADMIN_PASSWORD ||
    process.env.ADMIN_PASSWORD ||
    ''
  ).trim();

  if (!adminEmail || !adminPassword) {
    console.error('\n================================================================');
    console.error('CRITICAL SEED ERROR: Production admin credentials are missing!');
    console.error('Please set NOTESMAKER_ADMIN_EMAIL (or ADMIN_EMAIL) and NOTESMAKER_ADMIN_PASSWORD (or ADMIN_PASSWORD).');
    console.error('================================================================\n');
    throw new Error('Admin credentials (NOTESMAKER_ADMIN_EMAIL / ADMIN_EMAIL and password) are required to seed.');
  }

  console.log(`[SEED] Initializing production database for Notes Study...`);
  console.log(`[SEED] Admin Email: ${adminEmail}`);

  const adminPasswordHash = await hashPassword(adminPassword);

  // 1. Seed or update Admin User idempotently
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  });

  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        id: 'admin-1',
        name: 'Pooja',
        email: adminEmail,
        password: adminPasswordHash,
        role: 'ADMIN',
        college: 'Notes Study HQ'
      }
    });
    console.log(`[SEED] Production admin account created successfully.`);
  } else {
    await prisma.user.update({
      where: { email: adminEmail },
      data: {
        name: 'Pooja',
        password: adminPasswordHash,
        role: 'ADMIN'
      }
    });
    console.log(`[SEED] Production admin account credentials updated successfully.`);
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
  console.log(`[SEED] Seeded ${INITIAL_CATEGORIES.length} production categories.`);

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
  console.log(`[SEED] Seeded ${INITIAL_SUBCATEGORIES.length} production subcategories.`);
  console.log('[SEED] Production database initialization complete. Clean slate: No demo students, notes, or purchases.');
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
