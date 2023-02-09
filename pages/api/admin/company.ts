import { createClient } from '@supabase/supabase-js'
import type { NextApiRequest, NextApiResponse } from 'next'

import type { Database } from '@/types/supabase'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!req.method) {
    res.status(400).json({ success: false })
  }

  if (req.method === 'PATCH') {
    const body = req.body as Record<string, string>

    if (
      'name' in body &&
      'slug' in body &&
      'code' in body &&
      'color' in body &&
      'logoUrl' in body &&
      'resumeMessage' in body &&
      'websiteMessage' in body &&
      'prevSlug' in body
    ) {
      const {
        name,
        slug,
        code,
        color,
        logoUrl,
        resumeMessage,
        websiteMessage,
        prevSlug,
      } = body

      const publicUrl =
        logoUrl !== ''
          ? await getOrCreateLocalUrl(logoUrl, `${slug}/${code}/`)
          : ''

      const supabase = createClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.SUPABASE_SERVICE_ROLE_KEY || ''
      )

      const { status } = await supabase
        .from('Company')
        .update({
          slug,
          name,
          code,
          color,
          logoUrl: publicUrl,
          resumeMessage,
          websiteMessage,
          lastUpdated: new Date().toISOString(),
        })
        .eq('slug', prevSlug)

      return res.status(status).json({ success: true })
    } else {
      return res.status(400).json({ error: 'missing fields' })
    }
  } else if (req.method === 'POST') {
    const body = req.body as Record<string, string>

    if (
      'name' in body &&
      'slug' in body &&
      'code' in body &&
      'color' in body &&
      'logoUrl' in body &&
      'resumeMessage' in body &&
      'websiteMessage' in body
    ) {
      const {
        name,
        slug,
        code,
        color,
        logoUrl,
        resumeMessage,
        websiteMessage,
      } = body

      const publicUrl = await getOrCreateLocalUrl(logoUrl, `${slug}/${code}/`)

      const supabase = createClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.SUPABASE_SERVICE_ROLE_KEY || ''
      )
      const { status } = await supabase.from('Company').insert({
        slug,
        name,
        code,
        color,
        logoUrl: publicUrl,
        resumeMessage,
        websiteMessage,
      })

      return res.status(status).json({ success: true })
    }
  } else {
    return res.status(400).json({ error: 'missing fields' })
  }
}

async function getOrCreateLocalUrl(src: string, path: string) {
  const url = new URL(src)
  const segments = url.pathname.split('/')
  const filename = segments[segments.length - 1]
  const extension = filename.split('.').pop() ?? 'png'

  if (url.origin !== process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    )
    const blob = await fetch(src).then((r) => r.blob())
    await supabase.storage
      .from('hire-timfeeley')
      .upload(path + 'logo.' + extension, blob, {
        upsert: true,
      })
    const {
      data: { publicUrl },
    } = supabase.storage
      .from('hire-timfeeley')
      .getPublicUrl(path + 'logo.' + extension)

    return publicUrl
  } else {
    return src
  }
}
