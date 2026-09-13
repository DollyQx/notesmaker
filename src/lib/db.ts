import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Fallback dummy connection string for build-time safety when DATABASE_URL is not set
const fallbackUrl = 'postgresql://postgres:postgres@localhost:5432/notesmaker';

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL || fallbackUrl,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
