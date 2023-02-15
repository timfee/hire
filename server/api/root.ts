import aiRouter from './routers/ai'
import brandRouter from './routers/brand'
import companyRouter from './routers/company'
import { createTRPCRouter } from './trpc'

export const appRouter = createTRPCRouter({
  ai: aiRouter,
  brand: brandRouter,
  company: companyRouter,
})

export type AppRouter = typeof appRouter
