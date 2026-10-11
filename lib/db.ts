import { createRequire } from 'node:module';
import type { PrismaClient } from '@prisma/client';

const require = createRequire(import.meta.url);

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createFallbackProxy(): PrismaClient {
  return new Proxy({} as any, {
    get(_target, prop) {
      if (prop === '$queryRaw' || prop === '$disconnect' || prop === '$connect') {
        return async () => {
          throw new Error('Prisma client unavailable. Database is offline or @prisma/client is not generated.');
        };
      }
      return new Proxy({}, {
        get(_subTarget, subProp) {
          return async () => {
            console.warn(
              `[Prisma Offline] prisma.${String(prop)}.${String(subProp)} called but database is offline or @prisma/client is not generated.`
            );
            return null;
          };
        },
      });
    },
  });
}

function initializePrisma(): PrismaClient {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma;
  }

  try {
    const prismaModule = require('@prisma/client');
    const PrismaClientConstructor = prismaModule?.PrismaClient;
    if (PrismaClientConstructor) {
      const client = new PrismaClientConstructor({
        log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
      });
      if (process.env.NODE_ENV !== 'production') {
        globalForPrisma.prisma = client;
      }
      return client;
    }
  } catch (err: any) {
    console.warn('⚠️ [Prisma Warning] Could not initialize @prisma/client:', err?.message || err);
    console.warn('Running in memory-fallback mode. Run "npx prisma generate" to enable database syncing.');
  }

  const fallback = createFallbackProxy();
  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = fallback;
  }
  return fallback;
}

export const prisma: PrismaClient = initializePrisma();
export default prisma;

