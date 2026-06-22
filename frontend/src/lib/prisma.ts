import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.warn('DATABASE_URL is missing. Using dummy Prisma client for build phase.');
    return new Proxy({} as PrismaClient, {
      get(target, prop) {
        if (prop === 'then' || prop === '__esModule') return undefined;
        return new Proxy({}, {
          get(t, p) {
            if (p === 'then' || p === '__esModule') return undefined;
            return async () => null;
          }
        });
      }
    });
  }

  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : databaseUrl.includes('railway') || databaseUrl.includes('rlwy.net')
        ? { rejectUnauthorized: false }
        : false,
    max: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });
  const adapter = new PrismaPg(pool);
  
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : [],
  });
}

let prismaInstance: PrismaClient | undefined = globalForPrisma.prisma;

export const prisma = new Proxy({} as PrismaClient, {
  get(target, prop) {
    if (prop === 'then' || prop === '__esModule') return undefined;
    if (!prismaInstance) {
      prismaInstance = createPrismaClient();
      if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prismaInstance;
    }
    return Reflect.get(prismaInstance, prop);
  }
});
