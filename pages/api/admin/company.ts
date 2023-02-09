import { createClient } from '@supabase/supabase-js'
import type { NextApiRequest, NextApiResponse } from 'next'

import prisma from '@/lib/prisma'

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

      const publicUrl =
        logoUrl !== ''
          ? await getOrCreateLocalUrl(logoUrl, `${slug}/${code}/`)
          : ''

      const result = await prisma.company.update({
        where: { slug },
        data: {
          name,
          code,
          color,
          logoUrl: publicUrl,
          resumeMessage,
          websiteMessage,
        },
      })
      return res.status(200).json({ success: true, ...result })
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

      await prisma.company.create({
        data: {
          slug,
          name,
          code,
          color,
          logoUrl: publicUrl,
          resumeMessage,
          websiteMessage,
        },
      })

      res.status(200).json({ success: true, data: name })
    }
  } else {
    res.status(400).json({ success: false })
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
