import 'server-only'

import type { Company } from '@prisma/client'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { cache } from 'react'

import Letter from '@/components/Letter/Page'
import prisma from '@/lib/prisma'

export const revalidate = 10

export default async function CompanyPage({
  params: { slug, code },
}: {
  params: Pick<Company, 'code' | 'slug'>
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  let h = '~'
  const headersInstance = headers()
  for (const [key, value] of headersInstance) {
    h += `${key}: ${value}\n`
  }
  console.log(h)
  const companyData = await getCompanyData({ h, slug, code })

  return (
    <>
      <main className="mb-12">
        <Letter {...companyData} data-superjson />
      </main>
    </>
  )
}

const getCompanyData = cache(
  async ({ slug, code, h }: { h: string } & Pick<Company, 'code' | 'slug'>) => {
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
    await prisma.hit.create({
      data: {
        ip: h,
        companySlug: slug,
      },
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
export const dynamic = 'force-static'
