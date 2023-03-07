import aiRouter from './routers/ai'
import brandRouter from './routers/brand'
import companyRouter from './routers/company'
import { humanRouter } from './routers/human'
import { createTRPCRouter } from './trpc'

export const appRouter = createTRPCRouter({
  ai: aiRouter,
  brand: brandRouter,
  company: companyRouter,
  human: humanRouter,
})

export type AppRouter = typeof appRouter
