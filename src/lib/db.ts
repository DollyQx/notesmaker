import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

function getDatasourceUrl(): string | undefined {
  const url = process.env.DATABASE_URL;
  if (!url || url.trim().length === 0) {
    if (process.env.NODE_ENV === 'production') {
      console.error('CRITICAL DATABASE CONFIGURATION ERROR: DATABASE_URL environment variable is missing!');
      throw new Error('DATABASE_URL environment variable is required in production.');
    }
    return undefined;
  }
  return url.trim();
}

const dbUrl = getDatasourceUrl();

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    ...(dbUrl ? { datasourceUrl: dbUrl } : {}),
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
