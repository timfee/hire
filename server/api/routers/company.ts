import { refreshResumeUrl } from '@/lib/resume'
import { getRemoteImage, trimWhitespace } from '@/utils/images'
import { createSupabaseServerClient } from '@/utils/supabase'
import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '../trpc'

export const companyRouter = createTRPCRouter({
  regenerate: protectedProcedure
    .input(
      z.object({
        slug: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const supabase = createSupabaseServerClient()

      const { data: company } = await supabase
        .from('Company')
        .select()
        .eq('slug', input.slug)
        .single()

      if (!company) {
        throw Error('Company not found')
      }
      await refreshResumeUrl(company)
      await ctx.revalidate(`/${company.slug}/${company.code}`)
      return {
        success: true,
      }
    }),
  save: protectedProcedure
    .input(
      z.object({
        action: z.enum(['create', 'update']),
        company: z.object({
          code: z.string(),
          color: z.string(),
          logoUrl: z.string().url(),
          name: z.string(),
          originalSlug: z.string().optional(),
          resumeMessage: z.string(),
          slug: z.string(),
          websiteMessage: z.string(),
        }),
      })
    )
    .query(async ({ input }) => {
      const {
        action,
        company: { originalSlug, logoUrl, ...fields },
      } = input

      const supabase = createSupabaseServerClient()

      const {
        src: cdnUrl,
        height,
        width,
      } = await createOrGetLocalUrl(logoUrl, `${fields.slug}/${fields.code}/`)

      if (!cdnUrl) throw new Error('cdnUrl is required')
      if (!height) throw new Error('height is required')
      if (!width) throw new Error('width is required')

      if (action === 'create') {
        const result = await supabase.from('Company').insert({
          ...fields,
          created: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
          logoUrl: cdnUrl,
          logoHeight: height,
          logoWidth: width,
        })

        return result
      } else {
        if (!originalSlug)
          throw new Error('originalSlug is required for update')

        const result = await supabase
          .from('Company')
          .update({
            ...fields,
            lastUpdated: new Date().toISOString(),
            logoUrl: cdnUrl,
            logoHeight: height,
            logoWidth: width,
          })
          .eq('slug', originalSlug)

        return result
      }
    }),
})

async function createOrGetLocalUrl(src: string, path: string) {
  const url = new URL(src)
  const segments = url.pathname.split('/')
  const filename = segments[segments.length - 1]
  const extension = filename.split('.').pop() ?? 'png'

  const imageBytes = await getRemoteImage(src)

  const {
    imageBytes: trimmedImage,
    height,
    width,
  } = await trimWhitespace(Buffer.from(imageBytes))

  if (url.origin !== process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const supabase = createSupabaseServerClient()

    await supabase.storage
      .from('hire-timfeeley')
      .upload(path + 'logo.' + extension, trimmedImage, {
        upsert: true,
      })

    const {
      data: { publicUrl },
    } = supabase.storage
      .from('hire-timfeeley')
      .getPublicUrl(path + 'logo.' + extension)

    return { src: publicUrl, width, height }
  } else {
    return { src, width, height }
  }
}

export default companyRouter
