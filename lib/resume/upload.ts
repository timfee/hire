import { generateResumePacket } from '@/lib/resume/build'
import { createStandardClientWithRoleAccount } from '@/lib/supabase-server'
import type { Company } from '@/types/database'

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

  const supabase = createStandardClientWithRoleAccount()

  const { data, error } = await supabase.storage
    .from('hire-timfeeley')
    .upload(key, file, {
      cacheControl: 'no-cache',
      contentType: 'application/pdf',
      upsert: true,
    })

  if (!data) {
    console.error(data, error)
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
}: Partial<
  Pick<
    Company,
    'slug' | 'code' | 'name' | 'resumeLastGenerated' | 'lastUpdated'
  >
>) => {
  if (
    !code ||
    !name ||
    !slug ||
    typeof code !== 'string' ||
    typeof name !== 'string' ||
    typeof slug !== 'string'
  ) {
    throw new Error(
      `missing code: ${code ?? '[missing]'} name: ${
        name ?? '[missing]'
      } slug: ${slug ?? '[missing]'}`
    )
  }

  if (
    !resumeLastGenerated ||
    !lastUpdated ||
    typeof resumeLastGenerated !== 'string' ||
    typeof lastUpdated !== 'string' ||
    Date.parse(resumeLastGenerated) < Date.parse(lastUpdated)
  ) {
    const supabase = createStandardClientWithRoleAccount()

    await supabase
      .from('Company')
      .update({
        resumeLastGenerated: new Date().toISOString(),
        resumeUrl: await uploadFile({
          code,
          file: Buffer.from(await generateResumePacket({ slug })),
          name,
          slug,
        }),
      })
      .eq('slug', slug)
  }

  return `${process.env
    .NEXT_PUBLIC_SUPABASE_URL!}/storage/v1/object/public/hire-timfeeley/Tim Feeley's ${name} Resume.pdf`.replace(
    /\s/g,
    '%20'
  )
}
