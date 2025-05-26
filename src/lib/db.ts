import { PrismaClient } from '@prisma/client';

/* ⚠️  Ensure you keep a single PrismaClient
   instance in dev - HMR can otherwise spawn many */
const globalForPrisma = global as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['error'], // or ['query', 'info', 'warn', 'error'] for debugging
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
