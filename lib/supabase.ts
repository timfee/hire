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
    throw new Error('missing supabase url')
  }

  const key = `${slug}/${code}/Tim Feeley's ${name} Resume.pdf`

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  )

  console.log(file)
  const { data } = await supabase.storage
    .from('hire-timfeeley')
    .upload(key, file, {
      cacheControl: 'no-cache',
      contentType: 'application/pdf',
      upsert: true,
    })

  if (!data) {
    throw new Error('missing data')
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
  'code' | 'lastUpdated' | 'name' | 'resumeLastGenerated' | 'slug'
>) => {
  if (!resumeLastGenerated || resumeLastGenerated < lastUpdated) {
    return await prisma.company.update({
      data: {
        resumeLastGenerated: new Date(),
        resumeUrl: await uploadFile({
          code,
          file: Buffer.from(await generateResumePacket({ slug })),
          name,
          slug,
        }),
      },
      where: { slug },
    })
  }

  return `${process.env
    .NEXT_PUBLIC_SUPABASE_URL!}/storage/v1/object/public/hire-timfeeley/Tim Feeley's ${name} Resume.pdf`.replace(
    /\s/g,
    '%20'
  )
}
