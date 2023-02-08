import { PrismaClient } from '@prisma/client'

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

const client = globalThis.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalThis.prisma = client

export function exclude<T, Key extends keyof T>(
  data: T,
  keys: Key[]
): Omit<T, Key> {
  for (const key of keys) {
    delete data[key]
  }
  return data
}

export default client
