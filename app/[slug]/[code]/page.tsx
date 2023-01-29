import { notFound } from 'next/navigation'

import prisma from '@/lib/prisma'
import Letter from '@/components/Letter'
import type { Company } from '@prisma/client'

export default async function CompanyPage({
  params: { slug, code },
}: {
  params: Pick<Company, 'code' | 'slug'>
}) {
  const companyData = await getCompanyData({ slug, code })

  return (
    <main className="mb-12">
      <Letter {...companyData} />
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
