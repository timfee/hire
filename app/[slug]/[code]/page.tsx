import 'server-only'

import type { Company } from '@prisma/client'
import { notFound } from 'next/navigation'
import { cache } from 'react'

import Letter from '@/components/Letter/Page'
import prisma from '@/lib/prisma'

export const revalidate = 60

export default async function CompanyPage({
  params: { slug, code },
  searchParams,
}: {
  params: Pick<Company, 'code' | 'slug'>
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  const companyData = await getCompanyData({ slug, code })

  if (searchParams && searchParams.ld) {
    console.log('Logging disabled')
  }

  return (
    <>
      <main className="mb-12">
        <Letter {...companyData} data-superjson />
      </main>
    </>
  )
}

const getCompanyData = cache(
  async ({ slug, code }: Pick<Company, 'code' | 'slug'>) => {
    const returnFields = await prisma.company
      .findFirstOrThrow({
        select: {
          name: true,
          svg: true,
          color: true,
          websiteMessage: true,
          lastUpdated: true,
          code: true,
          slug: true,
        },
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

    return returnFields
  }
)
export async function generateStaticParams() {
  const companies = await prisma.company.findMany()

  return companies.map(({ slug, code }) => ({
    slug,
    code,
  }))
}
