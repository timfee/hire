import type { Company } from '@prisma/client'
import { notFound } from 'next/navigation'

import Letter from '@/components/Letter'
import prisma from '@/lib/prisma'

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
