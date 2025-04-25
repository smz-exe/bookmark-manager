// Import from the generated client location instead of the package
import { PrismaClient as ImportedPrismaClient } from '@prisma/client';

// Define a custom PrismaClient type if needed
export type PrismaClient = ImportedPrismaClient;

// Create client with global handling for Next.js development
const globalForPrisma = global as unknown as { prisma: ImportedPrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new ImportedPrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
