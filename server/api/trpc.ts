import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { initTRPC, TRPCError } from '@trpc/server'
import { type CreateNextContextOptions } from '@trpc/server/adapters/next'
import superjson from 'superjson'
import { type Database } from 'types/supabase'

export const createTRPCContext = async (opts: CreateNextContextOptions) => {
  const { req, res } = opts

  const supabase = createServerSupabaseClient<Database>({
    req,
    res,
  })
  const { data: session } = await supabase.auth.getSession()

  return {
    ...session,
    revalidate: res.revalidate,
  }
}

const t = initTRPC.context<typeof createTRPCContext>().create({
  errorFormatter({ shape }) {
    return shape
  },
  transformer: superjson,
})

export const createTRPCRouter = t.router

export const publicProcedure = t.procedure

const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (
    !ctx.session ||
    !ctx.session.user ||
    ctx.session.user.email !== process.env.OWNER_EMAIL
  ) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: { ...ctx.session, user: ctx.session.user },
    },
  })
})

export const protectedProcedure = t.procedure.use(enforceUserIsAuthed)
