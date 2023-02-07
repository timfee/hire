import type { Company } from '@prisma/client'
import { createClient } from '@supabase/supabase-js'

import prisma from '@/lib/prisma'
import { generateResumePacket } from '@/lib/resume/build'

export const uploadFile = async ({
  file,
  name,
  code,
  slug,
}: {
  file: Buffer
  name: string
  code: string
  slug: string
}) => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw Error('missing supabase url')
  }
  const key = `${slug}/${code}/Tim Feeley Resume - ${name}.pdf`

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  )
  const { data } = await supabase.storage
    .from('hire-timfeeley')
    .upload(key, file, {
      contentType: 'application/pdf',
      cacheControl: 'no-cache',
      upsert: true,
    })

  if (!data) {
    throw Error('missing data')
  }
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/hire-timfeeley/${data.path}`.replace(
    /\s/g,
    '%20'
  )
}

export const getLatestResume = async ({
  slug,
  code,
  name,
  resumeLastGenerated,
  lastUpdated,
}: Pick<
  Company,
  'slug' | 'code' | 'name' | 'resumeLastGenerated' | 'lastUpdated'
>) => {
  if (!resumeLastGenerated || resumeLastGenerated < lastUpdated) {
    return await prisma.company.update({
      where: { slug },
      data: {
        resumeLastGenerated: new Date(),
        resumeUrl: await uploadFile({
          code,
          name,
          slug,
          file: Buffer.from(await generateResumePacket({ slug })),
        }),
      },
    })
  } else {
    return `${process.env
      .NEXT_PUBLIC_SUPABASE_URL!}/storage/v1/object/public/hire-timfeeley/Tim Feeley Resume - ${name}.pdf`.replace(
      /\s/g,
      '%20'
    )
  }
}
