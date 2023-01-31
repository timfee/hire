import type { Company } from '@prisma/client'
import { notFound } from 'next/navigation'

import Letter from '@/components/Letter'
import prisma from '@/lib/prisma'
import { generateResumePacket } from '@/lib/resume'

export default async function CompanyPage({
  params: { slug, code },
}: {
  params: Pick<Company, 'code' | 'slug'>
}) {
  const companyData = await getCompanyData({ slug, code })
  const resumeData = await getResumeData({ slug, code, svg: companyData.svg })
  return (
    <main className="mb-12">
      <Letter
        {...companyData}
        resumeData={Buffer.from(resumeData).toString('base64')}
      />
    </main>
  )
}

const getCompanyData = async ({
  slug,
  code,
}: Pick<Company, 'code' | 'slug'>) => {
  return await prisma.company
    .findFirstOrThrow({
      where: {
        AND: {
          slug,
          code,
        },
      },
    })
    .catch(() => {
      notFound()
    })
}
const getResumeData = async ({
  slug,
  code,
  svg,
}: Pick<Company, 'code' | 'slug' | 'svg'>) => {
  return await generateResumePacket({
    code,
    slug,
    svg,
  })
}
