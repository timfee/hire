import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export function exclude<T, Key extends keyof T>(
  data: T,
  keys: Key[]
): Omit<T, Key> {
  for (const key of keys) {
    delete data[key]
  }
  return data
}

export default prisma
